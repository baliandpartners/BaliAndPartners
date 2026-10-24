# QA evidence

This report concerns the feature-branch review build, not a production deployment. See the final delivery report for the commit and hosted-preview status.

## Baseline

The original Vite build was preserved outside the checkout for comparison. Desktop (1440px) and mobile (390px, 320px) screenshots were inspected. The original had inaccessible icon controls, broken remote imagery, placeholder legal links, a form that only logged/reset data, missing metadata and unsupported testimonials/credentials. The audit records source-derived facts separately from inaccessible live-site observations.

## Browser validation

Playwright tests live in `project/tests/site.spec.ts`. They cover all 16 generated routes and HTTP 404 behaviour, real prerendered HTML, metadata and font/logo loading; mobile navigation and focus, the editorial specimen, method controls, filtering/search, article navigation, enquiry validation and email-draft generation, no POST/persistent personal data, and reduced motion.

Responsive checks use widths 320, 375, 390, 430, 768, 1024, 1440 and 1920px on the principal pages plus a service and article page. No horizontal overflow was found. Accessibility checks use axe-core WCAG A/AA rules at 390px and 1440px across 10 representative routes. These automated checks supplement keyboard and visual inspection; they are not a claim of universal accessibility certification.

## Deliberate visual refinement

Pass 1: inspected homepage, expertise, approach, about, contact, reading-room and article screenshots at desktop and mobile sizes. Refined native dialog keyboard wrapping; darkened small decorative captions; increased readability of founder copy on the dark section; adjusted method numbering to stop it competing with the heading; added a short reduced-motion-aware page entrance and font preloads.

Pass 2: recaptured principal page/viewport combinations after changes and inspected the opening composition, line wrapping, specimen, method panel, enquiry form and dark-section contrast. The final screenshots are stored with the review artifacts outside the checkout. `scripts/capture-review.mjs` reproduces the captures.

Scores measured on localhost do not establish real-world field Core Web Vitals or hosted Vercel performance. INP requires real interaction/field data and is not represented by a Lighthouse score.

## Final local results

- Production/static build and TypeScript: passed; 16 full HTML pages plus a real 404.
- ESLint and whitespace checks: passed.
- Playwright: **32 passed**, 0 failed, 0 skipped in the final regression run, including responsive checks at all eight requested widths and two accessibility runs covering ten routes each.
- Browser console/runtime errors: none observed in the final page captures and route tests.
- Screenshot pass 2: 20 page/viewport combinations, no overflow; full-page and first-screen captures retained.
- Dependency audit: 0 reported vulnerabilities across production and development dependencies.
- Contact test: validation and genuine email-draft generation passed; no POST request or browser persistence. No actual email delivery is claimed.

The first Lighthouse mobile run exposed uncompressed local delivery and unnecessary initial JavaScript/CSS. The preview server now mirrors compressed static delivery, interior pages load as a separate chunk, fonts are preloaded, and the initial page is readable immediately. Later route changes retain a short optional transition. The server renderer still imports interior pages eagerly so every route contains complete HTML; Vite's server-only eager/dynamic import warning reflects that deliberate arrangement.

### Lighthouse release measurements

Measured with Lighthouse 13.5.0 against the compressed local static preview, using its standard mobile and desktop presets:

| Metric | Mobile | Desktop |
| --- | ---: | ---: |
| Performance | 95 | 100 |
| Accessibility | 100 | 100 |
| Best practices | 100 | 100 |
| SEO | 69 | 69 |
| First contentful paint | 1.4 s | 0.3 s |
| Largest contentful paint | 2.9 s | 0.6 s |
| Total blocking time | 30 ms | 0 ms |
| Cumulative layout shift | 0 | 0 |

The SEO score reflects intentional preview indexing restrictions (`noindex`, preview response headers and robots.txt). It is not a production SEO score. The simulated mobile LCP remains above the 2.5-second target; hosted and field measurements may differ. JSON and HTML reports are retained in `/workspace/.cloud-setup/BaliAndPartners/rebuild-qa/lighthouse-{mobile,desktop}-release.report.*`.

## Authorised production release — 18 October 2026

The owner subsequently authorised publication to the existing main branch and Vercel project. The production build now enables indexing automatically when `VERCEL_ENV=production`; `VERCEL_ENV=preview` still blocks indexing even when `VITE_SITE_MODE=production` is supplied. Public privacy/terms copy describes the actual implementation and no longer refers to a development preview. Editorial essays remain labelled samples and unindexed.

- Preview-mode build and browser suite: **33 passed**, 0 failed, 0 skipped.
- Production-mode build and browser suite: **33 passed**, 0 failed, 0 skipped.
- TypeScript, ESLint and whitespace checks: passed.
- Added deployment checks for generated build mode, robots policy, sitemap exclusions and response indexing headers.
- Existing production deployment and main SHA were rechecked before publishing; the previous source remains available at `f06aa2060c374877460b9c9cba1643d719fec946`.

The newly supplied portrait was visible in the chat but was not exposed as a downloadable file or attachment identifier to the code workspace. It has not been substituted with another photograph or a generated likeness. A direct downloadable copy is required to add the exact image to the homepage and About founder sections. This remaining asset update can be published after launch using the same workflow.

### Live interaction refinement

The initial production deployment served all 16 routes, correct metadata, fonts, images, robots.txt and real 404 responses. Hosted browser testing exposed an early-input race: a visitor could type into the prerendered search field before its lazy-loaded React code attached the input handler. The DOM retained the text, but the results did not filter. Editable search and enquiry controls now stay disabled until hydration is complete, so the first accepted input is preserved. Two regression tests delay the interior JavaScript and verify search filtering and enquiry-name preservation after loading resumes.

The verification environment's Chromium certificate store does not contain its HTTPS proxy CA. Hosted browser checks therefore forward the real responses using Playwright's Node transport, the configured proxy and the system CA bundle, with TLS verification enabled. No certificate verification is disabled. This transport detail does not change the deployed site or its domain configuration.

After the input fix, the production build, TypeScript and ESLint passed, and the full browser suite completed **35 passed**, 0 failed, 0 skipped.


## Follow-up audit — 24 October 2026

Current evidence and release limitations are recorded in [AUDIT-2026-10.md](AUDIT-2026-10.md) and [FUNCTIONALITY-REGISTER.md](FUNCTIONALITY-REGISTER.md). The final local production build passes 45 browser tests and separate accessibility checks. The protected Vercel preview still needs authenticated acceptance before production; historical release results above do not establish that new deployment is verified.
