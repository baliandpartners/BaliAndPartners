# Bali & Partners

A bespoke legal content and strategy website, built in `project/` on `feature/premium-editorial-rebuild`. Production and the existing domains are unchanged.

## Develop and preview

Use Node.js 24 LTS (minimum 22.12) and npm. From the repository root:

```bash
cd project
npm ci
npm run dev
```

For the complete prerendered review build:

```bash
npm run build
npm run preview
```

The preview server prints its local address. It serves the same generated pages used for deployment, with real HTTP 404s and security headers. `dist/` is generated and is not committed. Existing cloud tasks already have an isolated checkout; a separate worktree is unnecessary.

## Validate

```bash
npm run typecheck
npm run lint
npm run test:e2e
npm run test:a11y
```

Tests use `/usr/bin/chromium` by default in this cloud image. Set `CHROMIUM_PATH` to a local Chromium/Chrome binary on another machine. The tests start the preview server if needed; run `npm run build` first. The suite checks every generated page, responsive widths from 320 to 1920px, routing, metadata, keyboard interaction, the editorial exhibit, search, the enquiry draft and accessibility. It never sends an enquiry.

## Project guide

- `src/components/SiteLayout.tsx`: responsive navigation, shared footer and page metadata.
- `src/pages/Home.tsx`: original editorial homepage and interactive capabilities index.
- `src/components/EditorialSpecimen.tsx`: fictional three-stage editing exhibit, with keyboard and touch support.
- `src/components/ContactForm.tsx`: validated, local-only email draft composer.
- `src/pages/Pages.tsx`: expertise, approach, reading room, about, contact and legal pages.
- `src/data/content.ts`: typed service and sample editorial content.
- `src/data/metadata.ts`: route metadata, canonical URLs and structured data.
- `src/index.css`, `src/pages/pages.css`, `src/components/interactive.css`: design tokens and component styles.
- `scripts/prerender.mjs`: generates HTML for all 16 routes plus a 404, sitemap and robots policy.
- `scripts/preview.mjs`: serves the built site with deployment headers.
- `scripts/capture-review.mjs`: saves desktop/mobile screenshots for review.
- `vercel.json`: build settings and headers for the `project/` application directory; no domain aliases or DNS settings.

## Important review boundaries

This is an approval build. Search indexing is disabled by default. Vercel Preview builds remain `noindex` even if a production-mode variable is inherited. No production deployment, merge or domain change is authorised.

The form prepares an email draft; a visitor must review and send it in their mail application. It does not submit to a backend, store personal data or pretend an email was sent. Editorial articles are clearly labelled samples. Supplied contact details, founder copy, legal notices and professional-conduct questions need confirmation before public release.

See [deployment and rollback](docs/DEPLOYMENT.md), [editorial maintenance](docs/CONTENT.md), [design system](docs/DESIGN.md), [release review](docs/RELEASE-REVIEW.md) and [QA evidence](docs/QA.md).
