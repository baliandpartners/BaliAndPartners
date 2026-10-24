# Search Console cleanup checklist

1. Confirm access to the verified baliandpartners.in domain property and inspect the canonical www host.
2. After the release, independently verify HTTP-to-HTTPS and apex-to-www permanent redirects, with valid certificates and no loops. Do not create the erroneous hostname merely to manage an old reference.
3. Inspect production robots.txt, sitemap.xml, page robots tags and response headers. Production approved pages should be indexable; sample essays and previews should remain excluded.
4. Submit https://www.baliandpartners.in/sitemap.xml. Inspect the homepage, every service, and an approved publication when available; request indexing only for intended canonical pages.
5. Use URL Inspection and the indexing report to locate obsolete Jekyll titles or URLs. Confirm the current response and Google-selected canonical before taking action.
6. If an obsolete URL must be retired, use an appropriate permanent redirect or 404/410 at the verified hosting layer. Use Search Console's temporary removal tool only when justified; it is not a replacement for fixing the source response.
7. Monitor duplicate/canonical exclusions, crawl errors and indexing changes after Google recrawls. Record actual observations; do not state that a URL was removed or indexed solely because a request was submitted.

No Search Console access or Google indexing change has been verified in this task.
