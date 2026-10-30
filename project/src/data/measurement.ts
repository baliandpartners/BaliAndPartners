export const measurementEvents = [
  "page_view",
  "discovery_complete",
  "brief_start",
  "brief_received",
  "enquiry_received",
  "callback_received",
  "lcp_good",
  "lcp_needs_improvement",
  "lcp_poor",
  "cls_good",
  "cls_needs_improvement",
  "cls_poor",
  "inp_good",
  "inp_needs_improvement",
  "inp_poor",
] as const;
export type MeasurementEvent = (typeof measurementEvents)[number];
export const measurementRoutes = [
  "/",
  "/expertise",
  "/expertise/legal-research",
  "/expertise/legal-content-editorial",
  "/expertise/thought-leadership",
  "/expertise/content-strategy",
  "/expertise/professional-communications",
  "/approach",
  "/insights",
  "/insights/article",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/404",
];
export function measurementRoute(path: string) {
  return measurementRoutes.includes(path)
    ? path
    : /^\/insights\/[a-z0-9-]+$/.test(path)
      ? "/insights/article"
      : "/404";
}
