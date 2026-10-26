import {
  createHash,
  createHmac,
  randomBytes,
  randomUUID,
  timingSafeEqual,
} from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import { validateEnquiry } from "../src/data/enquiry.ts";

type Request = IncomingMessage & { body?: unknown };
type Environment = Record<string, string | undefined>;
type Dependencies = {
  env?: Environment;
  fetch?: typeof fetch;
  now?: () => number;
};
const MAX_BODY = 12_000;
const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const digest = (key: string, value: string) =>
  createHmac("sha256", key).update(value).digest("hex");
const equal = (a: string, b: string) =>
  a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

export function createEnquiryHandler(dependencies: Dependencies = {}) {
  const env = dependencies.env ?? process.env;
  const fetcher = dependencies.fetch ?? fetch;
  const now = dependencies.now ?? Date.now;
  return async function handler(req: Request, res: ServerResponse) {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Robots-Tag", "noindex");
    const send = (status: number, body: object) => {
      res.statusCode = status;
      res.end(JSON.stringify(body));
    };
    if (req.method !== "GET" && req.method !== "POST") {
      res.setHeader("Allow", "GET, POST");
      return send(405, { error: "method_not_allowed" });
    }
    const allowed = new Set([
      "https://www.baliandpartners.in",
      "https://baliandpartners.in",
    ]);
    for (const value of [env.VERCEL_URL, env.VERCEL_BRANCH_URL]) {
      if (value && /^[a-z0-9.-]+\.vercel\.app$/.test(value))
        allowed.add(`https://${value}`);
    }
    if (env.NODE_ENV !== "production" && !env.VERCEL) {
      for (const port of [4173, 4175, 5173])
        for (const host of ["localhost", "127.0.0.1"])
          allowed.add(`http://${host}:${port}`);
    }
    const origin = req.headers.origin;
    if (
      (req.method === "POST" && (!origin || !allowed.has(origin))) ||
      (origin && !allowed.has(origin)) ||
      req.headers["sec-fetch-site"] === "cross-site"
    )
      return send(403, { error: "origin_not_allowed" });

    const url = env.SUPABASE_URL;
    const key = env.SUPABASE_SECRET_KEY;
    const secret = env.ENQUIRY_SIGNING_SECRET;
    if (
      !url ||
      !/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url) ||
      !key ||
      !secret ||
      secret.length < 32
    )
      return send(503, { error: "temporarily_unavailable" });
    // Vercel overwrites x-vercel-forwarded-for; never trust a caller's x-forwarded-for.
    const address = env.VERCEL
      ? req.headers["x-vercel-forwarded-for"]
      : req.socket.remoteAddress;
    if (typeof address !== "string" || !address)
      return send(503, { error: "temporarily_unavailable" });
    const clientHash = digest(secret, `client:${address.split(",")[0].trim()}`);
    const cookie = req.headers.cookie
      ?.split(";")
      .map((value) => value.trim())
      .find((value) => value.startsWith("bp_enquiry_session="))
      ?.slice("bp_enquiry_session=".length);
    const session = cookie && /^[a-f0-9]{64}$/.test(cookie) ? cookie : "";
    if (req.method === "GET") {
      const browserSession = session || randomBytes(32).toString("hex");
      res.setHeader(
        "Set-Cookie",
        `bp_enquiry_session=${browserSession}; Path=/api/enquiries; HttpOnly; SameSite=Strict; Max-Age=1800${env.VERCEL || env.NODE_ENV === "production" ? "; Secure" : ""}`,
      );
      const issued = `${now()}.${randomUUID()}`;
      return send(200, {
        challenge: `${issued}.${digest(secret, `${issued}:${browserSession}`)}`,
      });
    }
    if (
      req.headers["content-type"]?.split(";")[0].trim() !== "application/json"
    )
      return send(415, { error: "json_required" });
    if (Number(req.headers["content-length"] || 0) > MAX_BODY)
      return send(413, { error: "request_too_large" });
    let input: Record<string, unknown>;
    try {
      let raw = "";
      if (req.body !== undefined)
        raw =
          typeof req.body === "string" ? req.body : JSON.stringify(req.body);
      else {
        const chunks: Buffer[] = [];
        let bytes = 0;
        for await (const chunk of req) {
          const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
          bytes += buffer.length;
          if (bytes > MAX_BODY)
            return send(413, { error: "request_too_large" });
          chunks.push(buffer);
        }
        raw = Buffer.concat(chunks).toString("utf8");
      }
      if (Buffer.byteLength(raw) > MAX_BODY)
        return send(413, { error: "request_too_large" });
      input = JSON.parse(raw);
      if (!input || typeof input !== "object" || Array.isArray(input))
        throw new Error("Invalid body");
    } catch {
      return send(400, { error: "invalid_request" });
    }
    if (typeof input.website !== "string" || input.website !== "")
      return send(400, { error: "invalid_request" });
    const challenge =
      typeof input.challenge === "string" ? input.challenge : "";
    const parts = challenge.split(".");
    const timestamp = Number(parts[0]);
    if (
      !session ||
      parts.length !== 3 ||
      !UUID.test(parts[1]) ||
      !/^[a-f0-9]{64}$/.test(parts[2]) ||
      !Number.isFinite(timestamp) ||
      now() - timestamp > 30 * 60_000 ||
      timestamp > now() ||
      !equal(parts[2], digest(secret, `${parts[0]}.${parts[1]}:${session}`))
    )
      return send(400, { error: "challenge_expired" });
    if (now() - timestamp < 1000) {
      res.setHeader("Retry-After", "1");
      return send(429, { error: "please_wait" });
    }
    if (typeof input.requestId !== "string" || !UUID.test(input.requestId))
      return send(400, { error: "invalid_request" });
    const { values, errors } = validateEnquiry(input);
    if (Object.keys(errors).length)
      return send(422, { error: "validation_failed", fields: errors });
    const payload = { ...values, privacyVersion: "2026-10-24" };
    const payloadHash = createHash("sha256")
      .update(JSON.stringify(payload))
      .digest("hex");
    const contactHash = digest(
      secret,
      `contact:${values.contactPreference === "callback" ? values.phone.replace(/\D/g, "") : values.email}`,
    );
    try {
      const response = await fetcher(
        `${url}/rest/v1/rpc/submit_website_enquiry`,
        {
          method: "POST",
          headers: {
            apikey: key,
            ...(key.startsWith("sb_secret_")
              ? {}
              : { Authorization: `Bearer ${key}` }),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            p_request_id: input.requestId,
            p_payload: payload,
            p_payload_hash: payloadHash,
            p_client_hash: clientHash,
            p_contact_hash: contactHash,
          }),
          signal: AbortSignal.timeout(12_000),
        },
      );
      if (!response.ok) return send(503, { error: "temporarily_unavailable" });
      const result = await response.json();
      if (result?.status === "rate_limited") {
        res.setHeader("Retry-After", "3600");
        return send(429, { error: "rate_limited" });
      }
      if (result?.status === "conflict")
        return send(409, { error: "request_conflict" });
      if (
        !["saved", "duplicate"].includes(result?.status) ||
        result.id !== input.requestId
      )
        return send(503, { error: "temporarily_unavailable" });
      return send(result.status === "saved" ? 201 : 200, {
        received: true,
        reference: result.id,
      });
    } catch {
      // Do not log the submitted body, database response, credentials or personal data.
      return send(503, { error: "temporarily_unavailable" });
    }
  };
}
