import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import type { MeasurementEvent } from "../data/measurement";
import { allowed, measure } from "../data/measure";
const key = "bali-measurement";
export default function Measurement() {
  const { pathname } = useLocation();
  useEffect(() => {
    measure("page_view", pathname);
  }, [pathname]);
  useEffect(() => {
    if (!allowed()) return;
    // Web Vitals describe the initial document navigation, not each SPA route.
    const entryPath = window.location.pathname;
    let active = true;
    void import("web-vitals").then(({ onCLS, onINP, onLCP }) => {
      if (!active) return;
      const report = ({ name, rating }: { name: string; rating: string }) => {
        if (active)
          measure(
            `${name.toLowerCase()}_${rating.replace("-", "_")}` as MeasurementEvent,
            entryPath,
          );
      };
      onCLS(report);
      onINP(report);
      onLCP(report);
    });
    return () => {
      active = false;
    };
  }, []);
  return null;
}
export function MeasurementPreference() {
  const [enabled, setEnabled] = useState<boolean>();
  useEffect(() => {
    setEnabled(allowed());
  }, []);
  return (
    <div>
      <p>
        Optional, first-party measurement counts page views, service interest,
        service-finder completions and confirmed form receipts. It also groups
        loading, layout stability and interaction performance into quality
        bands. No enquiry contents, query strings, visitor IDs, tracking cookies
        or raw network addresses are stored in these measurements. Counts are
        not unique visitors and may include repeat visits or automated traffic.
        Daily totals are retained for up to 400 days. Browser Do Not Track and
        Global Privacy Control are respected.
      </p>
      <button
        type="button"
        className="text-link"
        disabled={enabled === undefined}
        aria-pressed={enabled === false}
        onClick={() => {
          try {
            localStorage.setItem(key, enabled ? "off" : "on");
            setEnabled(allowed());
          } catch {
            setEnabled(false);
          }
        }}
      >
        {enabled
          ? "Turn off anonymous measurement"
          : "Enable anonymous measurement"}
      </button>
      <p>
        Your choice is stored only in this browser. A browser privacy signal
        takes priority.
      </p>
    </div>
  );
}
