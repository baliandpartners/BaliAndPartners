# Bali & Partners

A bespoke legal content and strategy website, built in `project/`. The owner authorised production publication on 18 October 2026 using the existing GitHub/Vercel connection and domain configuration.

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

## Publishing and future updates

The Vercel production build enables search indexing. Local builds default to preview mode; use `VERCEL_ENV=production npm run build` to verify the release locally. Vercel Preview builds remain `noindex` even if a production-mode variable is inherited. Sample article pages always remain `noindex` and are excluded from the sitemap.

The site can be changed after launch. Edit content in `src/data/content.ts`, update page copy in `src/pages/`, and add approved images to `public/`. Develop on a feature branch, build and test, review its Vercel preview, then publish an approved update to `main`. The existing Vercel Git integration builds a new production version; the domain does not need to change. Git and Vercel retain previous versions for rollback.

The form prepares an email draft; a visitor must review and send it in their mail application. It does not submit to a backend, store personal data or pretend an email was sent. Editorial articles are clearly labelled samples. Public notices describe this implementation without claiming professional or regulatory certification.

See [deployment and rollback](docs/DEPLOYMENT.md), [editorial maintenance](docs/CONTENT.md), [design system](docs/DESIGN.md), [release review](docs/RELEASE-REVIEW.md) and [QA evidence](docs/QA.md).
