import { gzipSync } from "node:zlib";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";

const root = resolve("dist");
const { default: enquiryHandler } = await import("../api/enquiries.ts");
const { default: metricsHandler } = await import("../api/metrics.ts");
const args = process.argv.slice(2);
const option = (name, fallback) =>
  args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const port = Number(option("--port", process.env.PORT || "4173"));
const host = option("--host", "0.0.0.0");
const deploymentConfig = JSON.parse(
  await readFile(resolve("vercel.json"), "utf8"),
);
const manifest = JSON.parse(
  await readFile(resolve(root, "build-manifest.json"), "utf8"),
);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".pdf": "application/pdf",
};

createServer(async (request, response) => {
  if (new URL(request.url, "http://localhost").pathname === "/api/metrics") {
    if (!process.env.SUPABASE_SECRET_KEY) {
      response.writeHead(204, {
        "X-Website-Measurement": "disabled-in-local-preview",
      });
      response.end();
      return;
    }
    await metricsHandler(request, response);
    return;
  }
  if (new URL(request.url, "http://localhost").pathname === "/api/enquiries") {
    await enquiryHandler(request, response);
    return;
  }
  for (const header of deploymentConfig.headers[0].headers)
    response.setHeader(header.key, header.value);
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  response.setHeader("X-Frame-Options", "DENY");
  if (manifest.mode !== "production")
    response.setHeader("X-Robots-Tag", "noindex, nofollow");
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end("Method not allowed");
    return;
  }
  try {
    const pathname = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    let file = resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(`${root}${sep}`)) {
      response.writeHead(400);
      response.end("Invalid path");
      return;
    }
    let status = 200;
    // Match Vercel cleanUrls/trailingSlash policy without rewriting unknown URLs.
    const cleanPath =
      pathname === "/index.html"
        ? "/"
        : pathname
            .replace(/\/index\.html$/, "")
            .replace(/\/$/, "")
            .replace(/\.html$/, "");
    if (
      pathname !== "/" &&
      cleanPath !== pathname &&
      cleanPath.startsWith("/") &&
      !cleanPath.startsWith("//")
    ) {
      try {
        const candidate = resolve(root, `.${cleanPath}`, "index.html");
        if (
          candidate.startsWith(`${root}${sep}`) &&
          (await stat(candidate)).isFile()
        ) {
          response.writeHead(308, {
            Location:
              cleanPath + new URL(request.url, "http://localhost").search,
          });
          response.end();
          return;
        }
      } catch {
        /* Unknown routes still receive the real 404 below. */
      }
    }
    try {
      if ((await stat(file)).isDirectory()) file = resolve(file, "index.html");
      await stat(file);
    } catch {
      file = resolve(root, "404.html");
      status = 404;
    }
    let body = await readFile(file);
    const type = mime[extname(file)] || "application/octet-stream";
    response.setHeader("Vary", "Accept-Encoding");
    if (
      /text|javascript|json|xml|svg/.test(type) &&
      /gzip/.test(request.headers["accept-encoding"] || "")
    ) {
      body = gzipSync(body);
      response.setHeader("Content-Encoding", "gzip");
    }
    response.writeHead(status, {
      "Content-Type": mime[extname(file)] || "application/octet-stream",
      "Content-Length": body.length,
      "Cache-Control": file.includes(`${sep}assets${sep}`)
        ? "public, max-age=31536000, immutable"
        : "no-cache",
    });
    response.end(request.method === "HEAD" ? undefined : body);
  } catch {
    response.writeHead(400);
    response.end("Bad request");
  }
}).listen(port, host, () =>
  console.log(
    `Bali & Partners ${manifest.mode} preview: http://${host}:${port}`,
  ),
);
