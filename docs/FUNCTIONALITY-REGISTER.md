# Functionality register

Updated 26 October 2026. The site uses private Supabase enquiry/callback submissions. A receipt means that the database has confirmed storage; it does not mean an email was sent or a callback appointment was confirmed.

The previous service-page plus signs were decorative. All 24 service offerings now use native details/summary disclosures with specific descriptions of the work, outputs and review responsibilities. The entire row is clickable; Enter and Space toggle it; the same content remains usable without JavaScript. These changes incorporate and extend the previously unpublished service-accordion PR #3.

| Controls / location | Intended action | Verification |
| --- | --- | --- |
| Founder portrait on Home and About | Display the owner-approved photograph at the correct aspect ratio | Same-origin image loading, mobile/desktop dimensions and accessible caption/alt checks |
| Header/footer wordmarks and navigation | Open real pages | Every internal destination checked; navigation clicks and route metadata tests |
| Mobile navigation | Open/close, trap focus, restore focus, release scroll, navigate | Keyboard, Escape, touch and landscape tests |
| Skip link, scroll cue, back to top | Reach actual document targets | Fragment inventory and scroll/focus assertions |
| Five homepage capability links | Preview the selected service and open its page | Focus preview and link/navigation checks |
| Source / Structure / Clarity specimen | Change panels; advance and restart | Clicks, arrows, Home/End and focus checks |
| Homepage process controls | Reveal each process step | All five keyboard toggles, including selection before hydration |
| Five expertise cards | Open the corresponding service page | Route checks and service-page navigation |
| All 24 service offering rows | Reveal substantial service-specific content and collapse it | Every row clicked, then toggled with Enter/Space at 390/1440px; expanded-state accessibility; all rows also tested without JavaScript |
| Service enquiry and next-service links | Open Contact and the next service | Every service tested after direct navigation and refresh |
| Approach selectors and FAQs | Change process panel / expand answer | Every selector and disclosure exercised by keyboard |
| Insight filters and search | Filter by category and words; restore state after Back | All categories, combined queries, empty state, reset and rapid changes |
| Article cards, related links, section anchors | Open articles and navigate to content | All article routes, related navigation and actual section positions |
| Article copy button and fallback | Copy canonical URL or select it manually | Clipboard-success fixture and denied/unavailable clipboard fallback |
| Article reading progress | Reflect page position | Scroll-driven progress assertions |
| Enquiry and callback fields | Validate contact details, category, preferred window, message and consent | Required fields, all options, callback without email, character count and explicit consent |
| Send enquiry / Request a callback | Store privately and show a reference only after confirmation | Server validation, PostgreSQL security/quotas/idempotency tests, browser success/error tests; separate hosted database acceptance checks |
| Try again | Recover form availability after a temporary outage | Initial 503, retry, enabled form and successful receipt test |
| Retry after a submission error | Preserve details and avoid duplicate rows | Same request ID for unchanged retries, new ID after edits; server/database duplicate and conflict checks |
| Send another enquiry | Clear the confirmed request and start a new form session | Reset and availability checks |
| Direct email / telephone | Launch the visitor's email or phone handler | Published destinations and protocols inspected; no unsolicited email or phone call made |
| LinkedIn | Open the organisation's published URL | Valid HTTPS link; LinkedIn returns HTTP 999 to automated requests, so remote-page availability is unverified |
| Supabase / Vercel privacy links | Open processor privacy notices | Both destinations return HTTP 200 (Vercel redirects to its current notice) |
| Unknown routes and recovery CTAs | Return a real 404 and navigate back | Missing top-level, service and article routes checked |

## Coverage and limits

`npm run build`, `npm run lint`, `npm run test:server` and `npm run test:e2e` cover build correctness, server/database rules and browser behaviour. Form-response mocks test the visitor interface; they are not evidence of a real database write. Hosted acceptance checks independently verify private rows and remove only synthetic test records.

`node scripts/audit.mjs <base-url> <output-directory>` inventories links and visible controls, expanded service disclosures, mobile menus and clipboard fallback controls. It checks 16 published routes plus three 404 cases at 320, 375, 390, 430, 768, 1024, 1440 and 1920px. It records missing images/fragments, script errors, failed requests, horizontal overflow and internal destination status. Expanded disclosures are also inspected by the interaction tests.

External applications and email/telephone handlers remain controlled by their providers and the visitor's device. No test claims that a mailbox is monitored, a telephone call is answered, or LinkedIn allows automated access. Final deployment evidence is recorded in the release handoff.
