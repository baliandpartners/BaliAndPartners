# Editorial motion system

The navigation includes Contact on desktop and a direct Contact link beside the compact menu. Navigation arrays are shared without duplicate mobile/footer entries.

The experience uses native CSS/SVG and browser APIs, with no animation-library dependency. A fine-pointer precision ring complements the native pointer, never intercepts events and hides around editable fields, during keyboard navigation, on touch/coarse pointers and in reduced-motion mode. Bounded layered document movement responds only to pointer input. Hover highlights, arrow feedback, finite SVG line drawing, section entrances, native page transitions and animated service disclosures share short timing curves.

Page transitions prefetch interior code on intent, retain query strings, honour modifier/new-tab/download links and cancel pending transitions on browser history changes. Route changes reset scroll instantly and focus main content. Unsupported browsers use regular routing and entry styles. Native scrolling is preserved.

`MotionProvider` respects the operating-system preference; the footer control additionally stores a local, non-identifying `bali-motion` preference. Blocked browser storage is tolerated. Turning motion off cancels in-flight reveal animations and disables decorative CSS transitions. No animation runs in a continuous JavaScript loop: pointer/scroll updates are coalesced into a requested frame, and reveal observers disconnect when no longer needed. All content remains present without animation or JavaScript.

Validation covers desktop/compact Contact, duplicate-free navigation, fine-pointer artwork/control feedback, editable-field exclusion, real touch emulation, reduced motion, preference persistence, unavailable storage, unsupported View Transitions, rapid navigation, transition completion and Back restoration, alongside the full existing regression suite. Local mobile Lighthouse: 97 performance, 100 accessibility, 100 best practices, CLS 0 and TBT 0 ms. These are laboratory results, not field Core Web Vitals.
