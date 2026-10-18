import { readFile, writeFile, mkdir, rm, readdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { render, routes, isProductionSite } from "../.ssr/entry-server.js";

const output = resolve("dist");
const fonts = (await readdir(resolve(output, "assets"))).filter((name) =>
  name.endsWith(".woff2"),
);
const preload = fonts
  .map(
    (name) =>
      `<link rel="preload" href="/assets/${name}" as="font" type="font/woff2" crossorigin />`,
  )
  .join("\n    ");
const template = (
  await readFile(resolve(output, "index.html"), "utf8")
).replace("<!--font-preload-->", preload);
if (
  !template.includes("<!--app-html-->") ||
  !template.includes("<!--app-head-->")
) {
  throw new Error("Prerender placeholders are missing from the Vite template.");
}

for (const path of [...routes, "/404"]) {
  const { html, head } = render(path);
  const interiorCss = (await readdir(resolve(output, "assets"))).filter(
    (name) => name.startsWith("Pages-") && name.endsWith(".css"),
  );
  const routeStyles =
    path === "/"
      ? ""
      : interiorCss
          .map((name) => `<link rel="stylesheet" href="/assets/${name}" />`)
          .join("\n");
  const page = template
    .replace("<!--app-head-->", head + routeStyles)
    .replace("<!--app-html-->", html);
  const destination =
    path === "/404"
      ? resolve(output, "404.html")
      : resolve(output, `.${path}`, "index.html");
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, page);
}

const origin = "https://www.baliandpartners.in";
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
  .filter((path) => !path.startsWith("/insights/"))
  .map(
    (path) => `  <url><loc>${origin}${path === "/" ? "/" : path}</loc></url>`,
  )
  .join("\n")}\n</urlset>\n`;
await writeFile(resolve(output, "sitemap.xml"), sitemap);
await writeFile(
  resolve(output, "robots.txt"),
  isProductionSite
    ? `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`
    : "User-agent: *\nDisallow: /\n",
);
await writeFile(
  resolve(output, "build-manifest.json"),
  `${JSON.stringify({ mode: isProductionSite ? "production" : "preview", routes }, null, 2)}\n`,
);
await rm(resolve(".ssr"), { recursive: true, force: true });
console.log(
  `Prerendered ${routes.length} pages and a real 404. Search indexing: ${isProductionSite ? "enabled" : "disabled (preview)"}.`,
);
