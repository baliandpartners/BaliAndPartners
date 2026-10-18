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
