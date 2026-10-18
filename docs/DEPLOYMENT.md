# Preview, production and rollback

## Current boundary

The rebuild was developed on `feature/premium-editorial-rebuild`, based on original commit `f06aa2060c374877460b9c9cba1643d719fec946`. The owner explicitly authorised publication to `main` and Vercel production on 18 October 2026. The live project is Vercel `bali-and-partners`, connected to `baliandpartners/BaliAndPartners`. The public GitHub deployment records verify the existing production and preview integrations; account-level settings have not been changed.

Domain, DNS, certificate and project settings are preserved. The existing root `index.html` and `assets/` are preserved; the replacement lives in the existing `project/` application directory. Publication updates `main` through the existing Git integration.

## Review build

From `project/`, run `npm ci`, `npm run build`, then `npm run preview`. The build prerenders every route to `dist/<route>/index.html`; `dist/404.html` is the error page. There is no SPA fallback that returns a fake successful response for unknown URLs.

The installed filesystem and local server are separate from a hosted preview. A working local build is not evidence that Vercel deployed it.

### Existing Vercel Git integration

1. Confirm in Vercel that the connected repository is `baliandpartners/BaliAndPartners`, the project is `bali-and-partners`, and the production branch is not this feature branch.
2. The application directory is `project/`. If the existing project already uses that root, its branch preview should use `project/vercel.json`: `npm run build`, output `dist`, static Vite framework.
3. For review, push the feature branch and follow its Vercel deployment check to the **Preview** deployment. When the owner authorises production publication, update `main` without a force push; the existing integration creates the production deployment. Do not change domain aliases or project settings.
4. If the existing root setting differs, do not change the live project's shared root setting casually. Use a preview-only deployment with the application directory selected explicitly, or agree the configuration adjustment with the owner.
5. Verify the actual preview URL: root, a deep route, refresh, static fonts/logo, unknown-route 404, navigation, enquiry composer and response headers. An unverified deployment URL is not approval evidence.

The verified Git integration is sufficient for production publication; a separate Vercel CLI login is unnecessary. No credentials belong in Git, command output or chat; supply any future access requirements through secure environment configuration.

## Search and environment variables

No application secrets are required for the implemented site. Following launch approval, `VERCEL_ENV=production` enables indexing. Local builds default to review mode; `VITE_SITE_MODE=production` enables an explicit local release check. `VERCEL_ENV=preview` always forces preview mode. The HTML and the local preview server send noindex for preview builds; robots.txt disallows crawling. Sample article pages retain noindex in production mode and are excluded from the sitemap until replaced by approved editorial work.

Canonical URLs target the user-supplied `https://www.baliandpartners.in/`. This does not change DNS or assert independent ownership verification. Confirm the canonical host before launch. The alternate spelling `baliandpartner.in` was inaccessible and has not been treated as the same domain.

## Headers and hosting

`project/vercel.json` sets a restrictive content security policy, referrer policy, frame protection, content-type protection and permissions policy. Fonts, artwork, CSS and JavaScript are first-party. There is no tracking or embedded third-party content. Vercel supplies TLS for its deployment URL; no certificate or domain changes are required for a preview.

The site uses React inline style properties for the reading indicator, so the style policy allows inline styles. Script execution remains restricted to same-origin scripts. If a direct form provider or analytics service is added, review CSP, privacy and consent together; do not simply broaden the policy.

## Future direct enquiry delivery

There is deliberately no inactive API route or fake success state. `ContactForm.tsx` prepares a genuine `mailto:` draft and supports copying it. A direct form integration is a separate change requiring a selected provider and secure server-only credentials. Implement server-side schema validation, strict length limits, abuse controls/rate limits, origin validation and delivery-error handling. Test provider delivery with an approved destination before changing the UI to say 'sent'. Update the privacy notice to the provider's actual processing and retention practices.

## Production approval and rollback

The owner has authorised this launch. Future changes can follow the same feature-branch, preview, test and approved-main workflow. Run relevant checks after content or integration changes. Keep the public notices aligned with the actual form, hosting and data processing; this implementation does not assert that an independent legal review has occurred.

Keep the existing Vercel production deployment available. A future approved release can be rolled back through Vercel's deployment history to that known deployment; the original source is preserved at the base commit above. Domain/DNS records should not need to change.

The public GitHub deployment record identifies the pre-rebuild successful **Production** deployment as GitHub deployment `2853456655`, at the base commit above, with environment URL `https://bali-and-partners-g35lzptjf-baliandpartners-projects.vercel.app`. This is a GitHub deployment ID, not a Vercel deployment ID. The live `https://www.baliandpartners.in/` also returned the existing React application. Confirm the current production deployment again immediately before any future approved launch.
