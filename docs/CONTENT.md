# Maintaining content

Service and editorial copy live in `project/src/data/content.ts`, separate from page layouts. Each service has a slug, introduction, deliverables, audience and guiding principles. Each article has labelled content, an excerpt and a sequence of sections with stable IDs for its table of contents. `npm run build` discovers these records and creates their static routes.

The three essays are **editorial samples** about writing and publication practice. They have no invented publication date, named author, legal citation or client claim. They are labelled in the index, homepage and detail page, retain noindex and are excluded from the sitemap. Replace them with approved work before presenting them as publications. Change metadata and the sample-indexing rules deliberately when genuine publication material is supplied.

To add approved material, give it a unique slug and descriptive title, accurate category, short description, standfirst and substantive sections. Preserve existing slugs where possible. Compute reading estimates from the actual content. Obtain permission for photographs and verify all credentials and citations. For legal analysis, add source links/endnotes and substantive review before publication; the present sample essays require no fabricated authorities.

No CMS account or subscription is needed. The typed content module is the editorial source. A future MDX/CMS migration can reuse the page layouts without changing the public route structure, but should be introduced only when the publishing workflow warrants it.

Existing homepage anchors `#hero`, `#services`, `#about` and `#contact` continue to resolve. Policy links now lead to real pages. The original unverified testimonials, institutional claims and registration statements have been removed from the replacement.
