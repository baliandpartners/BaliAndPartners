import { measurementRoute, type MeasurementEvent } from "./measurement";
const key = "bali-measurement";
export function allowed() {
  if (
    navigator.doNotTrack === "1" ||
    (navigator as Navigator & { globalPrivacyControl?: boolean })
      .globalPrivacyControl
  )
    return false;
  try {
    return localStorage.getItem(key) !== "off";
  } catch {
    return false;
  }
}
export function measure(
  event: MeasurementEvent,
  path = window.location.pathname,
) {
  if (!allowed()) return;
  const body = JSON.stringify({ event, route: measurementRoute(path) });
  // No URL query, referrer, contact data, cookie, fingerprint or visitor ID is sent.
  void fetch("/api/metrics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    credentials: "omit",
    keepalive: true,
  }).catch(() => {});
}
