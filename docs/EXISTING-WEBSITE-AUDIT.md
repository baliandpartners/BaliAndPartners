# Bali & Partners — existing website and deployment audit

Audit date: 18 October 2026 (Asia/Kolkata). Source baseline: `f06aa2060c374877460b9c9cba1643d719fec946` (`Update Hero 1.tsx`). Repository: `baliandpartners/BaliAndPartners`. All audit actions were read-only with respect to repository files; reports, screenshots and an archived local build are outside the checkout. Other team members are implementing on `feature/premium-editorial-rebuild`.

## Access and evidence limits

- The user identifies the live Vercel project as `bali-and-partners`, attached to this repository, with production branch `main`.
- Read-only `git ls-remote origin refs/heads/main` succeeded using existing authentication and returned the baseline above. No token values were inspected or printed.
- No repository `.vercel/`, `vercel.json`, GitHub workflows, `.env` configuration, domain records, or CNAME file existed in the baseline. Vercel CLI is not installed. No Vercel-related environment-variable names or standard Vercel auth files were present. A GitHub token variable is present, but the HTTPS Git proxy is the only access confirmed usable.
- The GitHub REST repository, deployments, commit-status and check-run endpoints returned `Forbidden`. Vercel production root directory, deployment history, build settings, protection settings, team identifier and custom-domain association therefore remain unverified.
- Requests to `https://www.baliandpartners.in/` and `https://baliandpartner.in/` both failed at the egress proxy with `Tunnel connection failed: 403 Forbidden`. The alternative spelling is not established as owned, active or equivalent. Do not redirect to it, put it in metadata or modify its DNS.
- All eight named benchmark sites also returned the same proxy 403. These failures describe this environment's network access, not the public sites' availability.
- Local browser evidence is explicitly from the old repository build. It is not a live-site screenshot. Remote pictures failed in Chromium with `ERR_CERT_AUTHORITY_INVALID`; TLS verification was preserved. No measurements of the public website's security headers, speed or Core Web Vitals can be claimed.

## Complete codebase inventory and architecture

The repository contains a small React client application in `project/` alongside an obsolete root static site. There is no application backend, API handler, database, CMS, authentication, test suite, server framework or tracked deployment configuration.

| Path / area                                          | Finding                                                                                                                                                                                                                                         |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `README.md`                                          | Only `# Bali-and-Partners1`; no usable developer or release guidance.                                                                                                                                                                           |
| Root `index.html`                                    | Generated Jekyll v3.10.0 placeholder containing only the repository title. Canonical/OG URL is the incorrect `http://ww.baliandpartners.in/`. Loads root generated CSS and a CDN anchor script.                                                 |
| `assets/css/style.css`                               | Large generated GitHub/Jekyll theme including normalize.css v4.1.1. It is unrelated to the React application.                                                                                                                                   |
| `.DS_Store`, `assets/.DS_Store`, `project/.DS_Store` | Tracked OS metadata, unrelated to runtime.                                                                                                                                                                                                      |
| `project/package.json`, lockfile                     | React/ReactDOM 18.3.1, locked Vite 5.4.8, TypeScript 5.6.3, Tailwind 3.4.17; lucide-react icons. Scripts: dev, build, lint, preview. No test, typecheck, security or publishing command.                                                        |
| Vite config                                          | React plugin; lucide-react excluded from dependency optimization. No routing/SSR/security customization.                                                                                                                                        |
| TypeScript configs                                   | Strict frontend and Vite configuration projects with unused locals/parameters enforced.                                                                                                                                                         |
| ESLint config                                        | TypeScript/React hooks/refresh recommended rules, generated dist ignored.                                                                                                                                                                       |
| Tailwind/PostCSS                                     | Default utility configuration, no design tokens or extended theme.                                                                                                                                                                              |
| `project/index.html`                                 | Basic title, viewport and missing `/vite.svg` favicon; no description, social metadata or canonical URL.                                                                                                                                        |
| `src/main.tsx`                                       | React StrictMode, client-only createRoot mount.                                                                                                                                                                                                 |
| `src/index.css`                                      | Three Tailwind directives only.                                                                                                                                                                                                                 |
| `src/App.tsx`                                        | Single page composing nine content components. No router or route metadata.                                                                                                                                                                     |
| `Header.tsx`                                         | Fixed 64px header, raster logo with large internal whitespace; button-based section navigation; mobile menu toggle lacks accessible name and expanded state.                                                                                    |
| `Hero.tsx`                                           | External background picture, dark overlay, centered generic digital-agency positioning, blue CTA scrolling to contact.                                                                                                                          |
| `About.tsx`                                          | Mission/values/vision cards, external founder portrait, founder experience claims.                                                                                                                                                              |
| `Services.tsx`                                       | Four decorative cards: content, ghostwriting, legal SEO and LinkedIn. Cards look clickable but do not navigate.                                                                                                                                 |
| `HowWeWork.tsx`                                      | Four static stages: Discovery, Strategy, Creation, Optimize; unsupported claim of proven exceptional results.                                                                                                                                   |
| `FounderHighlight.tsx`                               | Duplicate founder section, Symbiosis Law School education claim, no independent substantiation.                                                                                                                                                 |
| `Testimonials.tsx`                                   | Three named testimonials, one with 300% engagement claim. No source or verification; auto-advance every 5s, unnamed navigation/dot controls.                                                                                                    |
| `Contact.tsx`                                        | Required name/email/message and optional company. Submit logs enquiry data to browser console and resets fields. No transmission or backend; apparent send action is misleading. Registered-agency/legal-compliance claim is not substantiated. |
| `Footer.tsx`                                         | Decorative service list, email rendered as text, supplied LinkedIn URL, policy/terms/disclaimer links all point to `#`.                                                                                                                         |
| `public/PRIMARY LOGO B&P 1..001.png`                 | 1920×1080 PNG, 94,059 bytes. Black Bali & Partners wordmark and gold ampersand on white with substantial whitespace; agrees with one supplied logo variant.                                                                                     |

Existing development artifacts `project/node_modules/` and `project/dist/` were initially untracked because the repository had no `.gitignore`. They are onboarding outputs, not authored source changes. Initial tracked worktree was clean. Original build copied outside the repository to `baseline/` for audit continuity before concurrent implementation.

## Content: verified, source-backed, and awaiting confirmation

The user's brief directly supplies the brand, positioning as a specialist legal content/research/editorial/strategy consultancy, founder name Shashwat Bali, New Delhi location and service scope. Those are appropriate foundations for the rebuild.

The source and brief agree on these public contact details; final publication should still confirm they are current:

- Email: `Shashwat@baliandpartners.in`
- Phone: `+91 82690 26882`
- Location: New Delhi, India

The original source links to `https://www.linkedin.com/company/balipartners/`; its ownership and current contents could not be checked. Source publication alone does not verify professional qualifications. Do not carry over the Symbiosis claim, registered-business claim, leading-litigators/top-tier-firms experience narrative, client names, testimonials, results or implied credentials without supporting evidence. No Bar Council status claim was found in the source; none should be introduced.

The founder portrait URL is present, but it could not be fetched or visually authenticated. Use only approved supplied photography; a restrained typographic founder introduction is preferable in this preview. The user has supplied approved brand logo images; preserve the brand design rather than substituting a new identity.

## Browser and visual findings

Local original-build screenshots:

- `audit-screenshots/baseline-1440.png` — 1440×1000 viewport, full page.
- `audit-screenshots/baseline-390.png` — 390×1000 viewport, full page.
- `audit-screenshots/baseline-320.png` — 320×1000 viewport, full page.

Evidence: `audit-baseline.json` and reproducible `audit-baseline.cjs`.

At all three widths the page rendered and document width equalled viewport width. This limited check did not find horizontal overflow. Six buttons lacked a text/ARIA accessible name. The founder picture and hero background failed externally. The local logo loaded. Page metadata had no description. No application JavaScript exceptions were observed; failed requests concerned remote pictures. This is a focused audit, not a full WCAG conformance assessment.

Visual inspection shows a small header logo due to its whitespace, default sans-serif hierarchy, centered copy throughout, repetitive icon/card groups, large hero dead space when the picture fails, duplicate founder content, pale neutral surfaces and bright-blue conversion buttons. Mobile stacks every card into a very long sequence, with little editorial hierarchy or variation. The result reads as a generic digital-marketing landing page rather than a specialist editorial consultancy.

Preserve: genuine brand mark, concise specialist positioning, verified contact channels, useful service categories and simple usability. Rewrite: positioning, founder introduction, process, service explanations and CTAs. Remove pending proof: testimonials/results/credentials/registration statements. Rebuild: information architecture, interaction semantics, visual system, legal pages, form behavior, SEO and deployment documentation.

Existing navigable section identifiers are `#hero`, `#about`, `#services` and `#contact`. Keep compatibility anchors or map these to the new meaningful destinations. No other historic application routes are evidenced. Root `/assets/css/style.css` is legacy static support, not an existing editorial route. Do not infer public `/project/` URLs from repository layout.

## Reference matrix and creative evaluation

Live browsing was attempted for every required reference. Because all requests were blocked, the following matrix records research status and intended assessment questions, not fabricated visual observations.

| Reference        | Access    | What to assess when access becomes available                        | Transfer principle appropriate to B&P                        |
| ---------------- | --------- | ------------------------------------------------------------------- | ------------------------------------------------------------ |
| Groom            | Proxy 403 | Specialist positioning, expertise discovery, editorial hierarchy    | Make the consultancy's precise discipline immediately clear. |
| White & Case     | Proxy 403 | Institutional navigation, responsive grid and publication structure | Clear taxonomy and disciplined information hierarchy.        |
| Freshfields      | Proxy 403 | Brand restraint, page rhythm and publication layouts                | Confidence through strong typography and space.              |
| Mishcon de Reya  | Proxy 403 | Brand personality, interaction restraint and content navigation     | A distinctive ownable interaction with useful purpose.       |
| Latham & Watkins | Proxy 403 | Expertise paths and professional-service content depth              | Meaningful service detail rather than decorative cards.      |
| Sidley           | Proxy 403 | Trust signals, editorial organization and accessibility             | Evidence-led copy and predictable navigation.                |
| A&O Shearman     | Proxy 403 | Identity consistency and navigation across content types            | One coherent visual and motion language.                     |
| Clifford Chance  | Proxy 403 | Thought leadership, filters and reading experience                  | Publication-quality article templates and legible citations. |

Three viable original hero directions considered against the brief:

1. Architectural authority: dark canvas, original geometric structure and large typography. Strong presence but requires careful balance to avoid a generic luxury-brand aesthetic.
2. Editorial canvas: ivory, oversized editorial serif, asymmetrical typesetting, thin rules and a focused dark or architectural feature. Most directly communicates writing/research; light asset weight and strong mobile adaptability.
3. Complexity to clarity: typographic document specimen resolves into structured prose. Most demonstrative, but too much explanation in the opening hero can obscure the business positioning.

Recommendation: use the editorial canvas as the overall art direction and make complexity-to-clarity a separate signature exhibit. Use warm ivory, institutional ink and restrained gold/bronze taken from the actual logo; avoid stock legal imagery. Use locally served licensed fonts. Keep ordinary cursor/navigation behavior; support keyboard, touch and reduced motion.

## Architecture and preview recommendation

Retain the existing React/TypeScript/Vite project under `project/` and replace its interface with a cohesive multi-route implementation. Static prerendered HTML for supported routes is a good fit for this small content consultancy, improves indexing and first render, and avoids adding a server framework with no functional need. Render genuine missing-route responses rather than rewriting every unknown URL into a successful home page. Maintain content as typed local data and provide editorial templates; no CMS credentials or operating cost are required for the review build.

Recommended routes: `/`, `/expertise`, five useful capability detail routes, `/approach`, `/insights`, clearly identified demonstration editorial detail pages, `/about`, `/contact`, `/privacy`, `/terms`. Do not fabricate published article metadata. The contact experience should be explicitly an email-draft workflow until an approved delivery service is configured; never claim a message was sent when only opening an email client.

Use local assets, responsive typography, semantic anchors/buttons, visible focus, accessible dialog/menu behavior, keyboard-operable tabs, reduced-motion CSS, per-route metadata, canonical primary-domain URLs, sitemap, preview noindex and appropriate security headers. Do not place confidential material or credentials in client bundles.

No actual Vercel setting can currently be verified. Repository configuration may support either the existing project root (`project`) or a repository-root build, but documentation must state that the live root setting is unknown. Do not run `vercel link`, alter project root, add aliases, change production branch, assign custom domains, modify DNS, run production deployment or promote/rollback a deployment as part of this task.

A safe externally hosted preview requires access to the existing `bali-and-partners` project and an explicitly preview-targeted deployment from `feature/premium-editorial-rebuild`, with no custom-domain assignment. The user has authorized preview delivery but has withheld production merge/deployment approval. A local server and tested static build can be completed without Vercel credentials; this cloud session currently exposes no verified public port-forwarding tool. A localhost URL must not be presented as a working publicly accessible approval preview.

If a feature-branch push is later used to invoke the existing Git integration, verify the project's production branch and preview behavior first when access is available; retain the branch and inspect the actual deployment output. Do not claim successful GitHub/Vercel publication based on build success alone.

Rollback preparation: preserve the original production commit and current Vercel production deployment identifier when accessible. Preview work requires no production rollback because no production mutation is performed. After future approval and deployment, reverting the release commit or promoting the previous known-good deployment should occur only with explicit production authorization and without domain changes.

## Outstanding approval/access items for final delivery

- Externally reachable preview hosting remains blocked by missing Vercel authentication/project metadata and network restrictions. The implementation and local QA are independent of this.
- Confirm current contact details and supplied logo usage before production release.
- Verify any proposed founder qualifications, business registration statements, publication authorship/dates and external social link before adding them.
- If direct form submission is required, securely configure an approved destination/provider and conduct an authorized delivery test. Otherwise the labelled email-draft alternative is honest and usable.
- Production merge, production deployment, custom domain and DNS changes remain explicitly outside the current authorization.

## Follow-up access observations

Later in the same task, GitHub public web/API access and the primary live domain became reachable. `https://www.baliandpartners.in/` returned the original React application title and Vite asset shell. GitHub identifies `main` as the default branch and records a successful Vercel Production deployment for the unchanged original commit `f06aa2060c374877460b9c9cba1643d719fec946` (deployment record 2853456655). The stored production deployment URL is `https://bali-and-partners-g35lzptjf-baliandpartners-projects.vercel.app`.

The repository homepage points to `https://bali-and-partners.vercel.app`, which returned Vercel `DEPLOYMENT_NOT_FOUND` (404); it should not be used as the new preview link. The primary custom domain continues to serve the original app. The account-level Vercel root-directory setting remains unverified.

The eight named design-reference sites and alternate spelling were retried after their required network destinations were saved; they still returned proxy CONNECT 403. The reference matrix therefore remains a record of requested benchmarks and unavailable direct inspection, not a claim that their current designs were studied.
