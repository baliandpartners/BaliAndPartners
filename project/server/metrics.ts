import type { IncomingMessage, ServerResponse } from "node:http";
import {
  measurementEvents,
  measurementRoutes,
} from "../src/data/measurement.ts";
type Request = IncomingMessage & { body?: unknown };
export function createMetricsHandler(
  env: Record<string, string | undefined> = process.env,
  fetcher: typeof fetch = fetch,
) {
  return async (req: Request, res: ServerResponse) => {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Robots-Tag", "noindex");
    const end = (status: number) => {
      res.statusCode = status;
      res.end();
    };
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return end(405);
    }
    const origins = new Set([
      "https://www.baliandpartners.in",
      "https://baliandpartners.in",
    ]);
    for (const value of [env.VERCEL_URL, env.VERCEL_BRANCH_URL])
      if (value && /^[a-z0-9.-]+\.vercel\.app$/.test(value))
        origins.add(`https://${value}`);
    if (
      !req.headers.origin ||
      !origins.has(req.headers.origin) ||
      req.headers["sec-fetch-site"] === "cross-site"
    )
      return end(403);
    if (req.headers.dnt === "1" || req.headers["sec-gpc"] === "1")
      return end(204);
    if (req.headers["content-type"]?.split(";")[0] !== "application/json")
      return end(415);
    if (Number(req.headers["content-length"] || 0) > 512) return end(413);
    let value: Record<string, unknown>;
    try {
      let raw = "";
      if (req.body !== undefined)
        raw =
          typeof req.body === "string" ? req.body : JSON.stringify(req.body);
      else {
        for await (const chunk of req) {
          raw += chunk.toString();
          if (Buffer.byteLength(raw) > 512) return end(413);
        }
      }
      if (Buffer.byteLength(raw) > 512) return end(413);
      value = JSON.parse(raw);
      if (
        !value ||
        typeof value !== "object" ||
        Array.isArray(value) ||
        Object.keys(value).length !== 2 ||
        typeof value.event !== "string" ||
        !(measurementEvents as readonly string[]).includes(value.event) ||
        typeof value.route !== "string" ||
        !measurementRoutes.includes(value.route)
      )
        return end(400);
    } catch {
      return end(400);
    }
    const { SUPABASE_URL: url, SUPABASE_SECRET_KEY: key } = env;
    if (!url || !/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url) || !key)
      return end(503);
    try {
      const response = await fetcher(
        `${url}/rest/v1/rpc/record_website_metric`,
        {
          method: "POST",
          headers: {
            apikey: key,
            ...(key.startsWith("sb_secret_")
              ? {}
              : { Authorization: `Bearer ${key}` }),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ p_event: value.event, p_route: value.route }),
          signal: AbortSignal.timeout(3000),
        },
      );
      return end(response.ok ? 204 : 503);
    } catch {
      return end(503);
    }
  };
}
