import { Suspense, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { applyPageMetadata } from "../data/metadata";
const navigation = [
  ["Expertise", "/expertise"],
  ["Our approach", "/approach"],
  ["Insights", "/insights"],
  ["About", "/about"],
] as const;

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link
      to="/"
      className={`brand${light ? " brand-light" : ""}`}
      aria-label="Bali & Partners — home"
    >
      <span className="brand-mark">
        <img
          src="/PRIMARY%20LOGO%20B&P%201..001.png"
          alt="Bali & Partners"
          width="1920"
          height="1080"
        />
      </span>
    </Link>
  );
}
function Header() {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  useEffect(() => {
    if (!open) return;
    const node = dialog.current;
    node?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      node?.close();
      document.body.style.overflow = previous;
    };
  }, [open]);
  const close = () => {
    setOpen(false);
    toggle.current?.focus();
  };
  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Brand />
          <nav className="desktop-nav" aria-label="Main navigation">
            {navigation.map(([label, href]) => (
              <NavLink key={href} to={href}>
                {label}
              </NavLink>
            ))}
          </nav>
          <Link className="header-enquiry" to="/contact">
            Start a conversation <ArrowUpRight size={17} />
          </Link>
          <button
            ref={toggle}
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="navigation-panel"
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
          >
            <Menu size={23} />
          </button>
        </div>
      </header>
      <dialog
        ref={dialog}
        id="navigation-panel"
        className="navigation-panel"
        aria-label="Site navigation"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const items = dialog.current?.querySelectorAll<HTMLElement>(
            "a[href], button:not([disabled])",
          );
          if (!items?.length) return;
          const first = items[0];
          const last = items[items.length - 1];
          if (
            event.shiftKey &&
            (document.activeElement === first ||
              document.activeElement === dialog.current)
          ) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className="menu-top">
          <span className="eyebrow">Bali & Partners</span>
          <button
            type="button"
            className="icon-button"
            onClick={close}
            aria-label="Close navigation"
          >
            <X />
          </button>
        </div>
        <nav aria-label="Expanded navigation">
          {[["Home", "/"], ...navigation, ["Contact", "/contact"]].map(
            ([label, href], i) => (
              <Link
                onClick={() => setOpen(false)}
                aria-current={location.pathname === href ? "page" : undefined}
                key={href}
                to={href}
              >
                <span className="menu-index">0{i + 1}</span>
                {label}
                <ArrowUpRight />
              </Link>
            ),
          )}
        </nav>
        <div className="menu-bottom">
          <span>Legal substance. Editorial precision.</span>
          <span>New Delhi, India</span>
        </div>
      </dialog>
    </>
  );
}
export function ClosingNote() {
  return (
    <section className="closing-note">
      <div className="container closing-grid">
        <div>
          <p className="eyebrow">A considered conversation</p>
          <h2>
            Good work begins
            <br />
            with <em>understanding.</em>
          </h2>
        </div>
        <div className="closing-aside">
          <p>
            Share the subject, audience and intended format.
            <br />
            We can discuss the scope and the support you need.
          </p>
          <Link className="button button-dark" to="/contact">
            Start a conversation <ArrowUpRight size={19} />
          </Link>
        </div>
      </div>
    </section>
  );
}
function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <Brand light />
            <p>
              Legal knowledge.
              <br />
              Considered communication.
            </p>
            <span className="footer-location">
              <span className="status-dot" /> New Delhi, India
            </span>
          </div>
          <div className="footer-nav">
            <p className="eyebrow">Explore</p>
            {navigation.map(([label, href]) => (
              <Link key={href} to={href}>
                {label}
              </Link>
            ))}
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-contact">
            <p className="eyebrow">Get in touch</p>
            <a href="mailto:Shashwat@baliandpartners.in">
              Shashwat@baliandpartners.in <ArrowUpRight size={16} />
            </a>
            <a href="tel:+918269026882">+91 82690 26882</a>
            <a
              className="footer-social"
              href="https://www.linkedin.com/company/balipartners/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn <ArrowUpRight size={14} />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Bali & Partners</span>
          <span className="footer-description">
            Legal content & strategy consultancy
          </span>
          <div>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Website terms</Link>
            <a href="#top" className="back-top" aria-label="Back to top">
              <ArrowDown size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
function RouteEffects() {
  const { pathname, hash } = useLocation();
  const previousPath = useRef(pathname);
  useEffect(() => {
    if (hash) {
      let id = hash.slice(1);
      try {
        id = decodeURIComponent(id);
      } catch {
        /* A malformed fragment is harmless. */
      }
      requestAnimationFrame(() =>
        document.getElementById(id)?.scrollIntoView(),
      );
    } else if (previousPath.current !== pathname) {
      window.scrollTo(0, 0);
      document.getElementById("main-content")?.focus({ preventScroll: true });
    }
    previousPath.current = pathname;
    applyPageMetadata(pathname);
  }, [pathname, hash]);
  return null;
}
export default function SiteLayout() {
  const { pathname } = useLocation();
  const initialPath = useRef(pathname);
  return (
    <div id="top">
      <a href="#main-content" className="skip-link">
        Skip to content <ArrowRight size={16} />
      </a>
      <Header />
      <RouteEffects />
      <main id="main-content" tabIndex={-1}>
        <div
          key={pathname}
          className={
            pathname === initialPath.current
              ? "page-enter"
              : "page-enter route-enter"
          }
        >
          <Suspense
            fallback={
              <p className="container route-loading" role="status">
                Opening the page…
              </p>
            }
          >
            <Outlet />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
