export interface ArticleSection {
  id: string;
  title: string;
  paragraphs: string[];
  sourceIds?: string[];
}

interface ArticleBase {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  description: string;
  standfirst: string;
  sections: ArticleSection[];
  relatedSlugs?: string[];
  tags?: string[];
}

export interface ArticleSource {
  id: string;
  title: string;
  citation: string;
  url: string;
}
export type Article = ArticleBase &
  (
    | { kind: "sample"; label: "Editorial sample" }
    | {
        kind: "publication";
        label: "Legal perspective";
        approved: true;
        author: { name: string; role?: string };
        publishedAt: string;
        reviewedAt?: string;
        updatedAt?: string;
        jurisdiction: string;
        sources: ArticleSource[];
        qualifications: string;
        disclaimer: string;
        indexable: boolean;
      }
  );

/** Publication records must be approved and supplied with verified source material. */
export function isIndexableArticle(article: Article) {
  return (
    article.kind === "publication" &&
    article.approved === true &&
    article.indexable
  );
}

export function validateArticles(records: Article[]) {
  const slugs = new Set<string>();
  const date = (value: string) =>
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value;
  for (const article of records) {
    if (
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug) ||
      slugs.has(article.slug)
    )
      throw new Error(`Invalid or duplicate article slug: ${article.slug}`);
    slugs.add(article.slug);
    if (
      article.tags &&
      (article.tags.length > 8 ||
        article.tags.some(
          (tag) => typeof tag !== "string" || !tag.trim() || tag.length > 40,
        ))
    )
      throw new Error("Invalid article tags");
    if (
      !article.title.trim() ||
      !article.standfirst.trim() ||
      !article.sections.length
    )
      throw new Error(`Incomplete article: ${article.slug}`);
    const ids = article.sections.map((section) => section.id);
    if (
      new Set(ids).size !== ids.length ||
      ids.some((id) => !/^[a-z0-9-]+$/.test(id))
    )
      throw new Error(`Invalid section anchors: ${article.slug}`);
    if (article.kind === "publication") {
      if (
        article.approved !== true ||
        !article.author.name.trim() ||
        !date(article.publishedAt) ||
        (article.reviewedAt && !date(article.reviewedAt)) ||
        (article.updatedAt &&
          (!date(article.updatedAt) ||
            article.updatedAt < article.publishedAt)) ||
        !article.jurisdiction.trim() ||
        !article.qualifications.trim() ||
        !article.disclaimer.trim() ||
        !article.sources.length
      )
        throw new Error(
          `Publication approval, attribution, dates or sources missing: ${article.slug}`,
        );
      const sourceIds = new Set<string>();
      for (const source of article.sources) {
        if (
          !/^[a-z0-9-]+$/.test(source.id) ||
          sourceIds.has(source.id) ||
          ids.includes(`source-${source.id}`) ||
          !source.title.trim() ||
          !source.citation.trim()
        )
          throw new Error(`Invalid source: ${article.slug}`);
        const url = new URL(source.url);
        if (url.protocol !== "https:" || url.username || url.password)
          throw new Error(
            `Source must use a public HTTPS URL: ${article.slug}`,
          );
        sourceIds.add(source.id);
      }
      if (
        article.sections.some((section) =>
          section.sourceIds?.some((id) => !sourceIds.has(id)),
        )
      )
        throw new Error(`Unresolved citation: ${article.slug}`);
    }
  }
  for (const article of records) {
    if (
      article.relatedSlugs?.some(
        (slug) => !slugs.has(slug) || slug === article.slug,
      )
    )
      throw new Error(`Invalid related reading: ${article.slug}`);
  }
}
