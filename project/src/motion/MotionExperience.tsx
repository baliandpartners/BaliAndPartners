import { useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useMotion } from "./context";

let pageModule: Promise<unknown> | undefined;
const warmPages = () => (pageModule ??= import("../pages/Pages"));
const surfaceSelector =
  ".capability-row, .home-article, .expertise-entry, .deliverable-accordion, .method-step";

export default function MotionExperience() {
  const { enabled } = useMotion();
  const cursor = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const go = useRef(navigate);
  useEffect(() => {
    go.current = navigate;
  }, [navigate]);

  // One frame per scroll/resize event; no continuously running animation loop.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const height = document.documentElement.scrollHeight - innerHeight;
      document.documentElement.style.setProperty(
        "--page-progress",
        String(height > 0 ? Math.min(1, Math.max(0, scrollY / height)) : 0),
      );
      document.documentElement.dataset.scrolled =
        scrollY > 16 ? "true" : "false";
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const resize = new ResizeObserver(schedule);
    resize.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    update();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const seen = new WeakSet<Element>();
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            if (matchMedia("(prefers-reduced-motion: reduce)").matches)
              continue;
            const animation = entry.target.animate(
              [
                { opacity: 1, transform: "translateY(16px)" },
                { opacity: 1, transform: "translateY(0)" },
              ],
              { duration: 520, easing: "cubic-bezier(.2,.7,.2,1)" },
            );
            animations.add(animation);
            animation.finished
              .catch(() => {})
              .finally(() => animations.delete(animation));
          }
      },
      { threshold: 0.12 },
    );
    const scan = () =>
      document
        .querySelectorAll(
          "main .section-title, main .section-heading, main .founder-portrait, main .home-article, main .principle",
        )
        .forEach((element) => {
          if (seen.has(element)) return;
          seen.add(element);
          // Above-the-fold content is never hidden while waiting for JavaScript.
          if (element.getBoundingClientRect().top >= innerHeight - 30)
            observer.observe(element);
        });
    const changes = new MutationObserver(scan);
    const main = document.querySelector("main");
    if (main) changes.observe(main, { childList: true, subtree: true });
    scan();
    return () => {
      observer.disconnect();
      changes.disconnect();
      animations.forEach((animation) => animation.cancel());
    };
  }, [enabled]);

  useEffect(() => {
    const ring = cursor.current;
    if (!enabled || !ring) return;
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0;
    let x = 0,
      y = 0;
    let displayedX = 0,
      displayedY = 0,
      previousTime = 0;
    let target: Element | null = null;
    let surface: HTMLElement | null = null;
    let artwork: HTMLElement | null = null;
    const resetArt = () => {
      artwork?.style.removeProperty("--art-x");
      artwork?.style.removeProperty("--art-y");
      artwork = null;
    };
    const hide = () => {
      ring.dataset.visible = "false";
      ring.dataset.active = "false";
      surface?.removeAttribute("data-pointer-over");
      surface = null;
      previousTime = 0;
      cancelAnimationFrame(frame);
      frame = 0;
      resetArt();
    };
    const draw = (time: number) => {
      frame = 0;
      if (
        !target ||
        !fine.matches ||
        document.querySelector("dialog[open]") ||
        target.closest("input,textarea,select,[contenteditable=true]")
      ) {
        hide();
        return;
      }
      const interactive = !!target.closest(
        "a[href],button:not(:disabled),summary,[role=tab]:not(:disabled)",
      );
      // Keep the native pointer clean on reading surfaces. The small halo only
      // accompanies controls, with quick, refresh-rate-independent settling.
      if (!interactive || ring.dataset.visible !== "true") {
        displayedX = x;
        displayedY = y;
      } else {
        const delta = Math.min(32, Math.max(0, time - previousTime));
        const ease = 1 - Math.exp(-delta / 35);
        displayedX += (x - displayedX) * ease;
        displayedY += (y - displayedY) * ease;
      }
      previousTime = time;
      const settled = Math.hypot(x - displayedX, y - displayedY) < 0.15;
      if (settled) {
        displayedX = x;
        displayedY = y;
      }
      ring.style.transform = `translate3d(${displayedX}px,${displayedY}px,0)`;
      ring.dataset.visible = interactive ? "true" : "false";
      ring.dataset.active = interactive ? "true" : "false";
      if (interactive && !settled) frame = requestAnimationFrame(draw);
      const next = target.closest<HTMLElement>(surfaceSelector);
      if (next !== surface) {
        surface?.removeAttribute("data-pointer-over");
        surface = next;
      }
      if (surface) {
        const box = surface.getBoundingClientRect();
        surface.style.setProperty("--surface-x", `${x - box.left}px`);
        surface.style.setProperty("--surface-y", `${y - box.top}px`);
        surface.dataset.pointerOver = "true";
      }
      const nextArt = target.closest<HTMLElement>(".editorial-art");
      if (nextArt !== artwork) {
        resetArt();
        artwork = nextArt;
      }
      if (artwork) {
        const box = artwork.getBoundingClientRect();
        artwork.style.setProperty(
          "--art-x",
          String(
            Math.max(-1, Math.min(1, ((x - box.left) / box.width) * 2 - 1)),
          ),
        );
        artwork.style.setProperty(
          "--art-y",
          String(
            Math.max(-1, Math.min(1, ((y - box.top) / box.height) * 2 - 1)),
          ),
        );
      }
    };
    const move = (event: PointerEvent) => {
      if (
        event.pointerType !== "mouse" ||
        event.buttons !== 0 ||
        !fine.matches
      ) {
        hide();
        return;
      }
      x = event.clientX;
      y = event.clientY;
      target = event.target instanceof Element ? event.target : null;
      if (!frame) {
        previousTime = performance.now();
        frame = requestAnimationFrame(draw);
      }
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === "Tab") hide();
    };
    fine.addEventListener("change", hide);
    window.addEventListener("pointerdown", hide, { passive: true });
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);
    window.addEventListener("scroll", hide, { passive: true });
    window.addEventListener("keydown", key);
    return () => {
      hide();
      surface?.removeAttribute("data-pointer-over");
      fine.removeEventListener("change", hide);
      window.removeEventListener("pointerdown", hide);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
      window.removeEventListener("scroll", hide);
      window.removeEventListener("keydown", key);
    };
  }, [enabled]);

  useEffect(() => {
    document.documentElement.dataset.viewTransitions =
      enabled && !!document.startViewTransition ? "true" : "false";
    let sequence = 0;
    let transition: ViewTransition | undefined;
    const linkFor = (target: EventTarget | null) =>
      target instanceof Element
        ? target.closest<HTMLAnchorElement>("a[href]")
        : null;
    const warm = (event: Event) => {
      const link = linkFor(event.target);
      if (
        link &&
        link.origin === location.origin &&
        link.pathname !== location.pathname &&
        !link.download
      )
        void warmPages().catch(() => {});
    };
    const click = async (event: MouseEvent) => {
      const link = linkFor(event.target);
      if (
        !enabled ||
        !document.startViewTransition ||
        !link ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        link.target ||
        link.hasAttribute("download") ||
        link.origin !== location.origin ||
        link.pathname === location.pathname
      )
        return;
      event.preventDefault();
      const ticket = ++sequence;
      const destination = link.pathname + link.search + link.hash;
      try {
        await warmPages();
      } catch {
        if (ticket === sequence) location.assign(link.href);
        return;
      }
      if (ticket !== sequence) return;
      transition?.skipTransition();
      document.documentElement.dataset.transition = "active";
      const change = () => flushSync(() => go.current(destination));
      try {
        transition = document.startViewTransition(() => {
          if (ticket === sequence) change();
        });
        const current = transition;
        void current.ready.catch(() => {});
        void current.finished
          .catch(() => {})
          .finally(() => {
            if (transition === current)
              delete document.documentElement.dataset.transition;
          });
      } catch {
        delete document.documentElement.dataset.transition;
        change();
      }
    };
    const cancelPending = () => {
      sequence++;
      transition?.skipTransition();
    };
    window.addEventListener("popstate", cancelPending);
    document.addEventListener("pointerover", warm, { passive: true });
    document.addEventListener("focusin", warm);
    document.addEventListener("click", click, true);
    return () => {
      sequence++;
      window.removeEventListener("popstate", cancelPending);
      transition?.skipTransition();
      delete document.documentElement.dataset.transition;
      document.removeEventListener("pointerover", warm);
      document.removeEventListener("focusin", warm);
      document.removeEventListener("click", click, true);
    };
  }, [enabled]);

  return (
    <div
      ref={cursor}
      className="precision-cursor"
      aria-hidden="true"
      data-visible="false"
    >
      <span className="precision-cursor-ring" />
    </div>
  );
}
