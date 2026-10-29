import { startTransition, useEffect, useState, type ReactNode } from "react";
import { MotionContext, useMotion } from "./context";

const preferenceKey = "bali-motion";
export default function MotionProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState({
    ready: false,
    allowed: true,
    reduced: false,
  });
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      let allowed = true;
      try {
        allowed = localStorage.getItem(preferenceKey) !== "reduced";
      } catch {
        /* Storage is optional. */
      }
      startTransition(() => {
        setPreference({ ready: true, allowed, reduced: query.matches });
      });
    };
    update();
    query.addEventListener("change", update);
    window.addEventListener("storage", update);
    return () => {
      query.removeEventListener("change", update);
      window.removeEventListener("storage", update);
    };
  }, []);
  const enabled = preference.ready && preference.allowed && !preference.reduced;
  useEffect(() => {
    document.documentElement.dataset.motion = enabled ? "on" : "off";
    return () => {
      delete document.documentElement.dataset.motion;
    };
  }, [enabled]);
  return (
    <MotionContext.Provider
      value={{
        enabled,
        ready: preference.ready,
        systemReduced: preference.reduced,
        toggle: () => {
          const allowed = !preference.allowed;
          try {
            localStorage.setItem(preferenceKey, allowed ? "full" : "reduced");
          } catch {
            /* Preference still works for this visit. */
          }
          setPreference((previous) => ({ ...previous, allowed }));
        },
      }}
    >
      {children}
    </MotionContext.Provider>
  );
}

export function MotionToggle() {
  const { enabled, ready, systemReduced, toggle } = useMotion();
  if (systemReduced)
    return (
      <span className="motion-preference">
        Motion reduced · device preference
      </span>
    );
  return (
    <button
      type="button"
      className="motion-preference"
      disabled={!ready}
      aria-pressed={!enabled}
      aria-label="Reduce visual motion"
      onClick={toggle}
    >
      <span className="motion-indicator" aria-hidden="true" />
      Motion: {enabled ? "on" : "reduced"}
    </button>
  );
}
