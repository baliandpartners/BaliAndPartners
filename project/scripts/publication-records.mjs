import { validateArticles } from "../src/data/publication.ts";
export function publicRecords(rows) {
  if (!Array.isArray(rows) || rows.length >= 1000)
    throw new Error("Publication collection needs review");
  const fields = [
    "slug",
    "title",
    "category",
    "tags",
    "excerpt",
    "description",
    "standfirst",
    "relatedSlugs",
    "kind",
    "label",
    "approved",
    "publishedAt",
    "reviewedAt",
    "updatedAt",
    "jurisdiction",
    "qualifications",
    "disclaimer",
    "indexable",
  ];
  const clean = rows.map(({ document: item }) => {
    if (
      item.kind !== "publication" ||
      item.approved !== true ||
      item.label !== "Legal perspective"
    )
      throw new Error("Unapproved publication");
    const result = Object.fromEntries(
      fields
        .filter((field) => item[field] !== undefined)
        .map((field) => [field, item[field]]),
    );
    result.author = {
      name: item.author?.name,
      ...(item.author?.role ? { role: item.author.role } : {}),
    };
    result.sections = item.sections?.map((section) => ({
      id: section.id,
      title: section.title,
      paragraphs: section.paragraphs,
      ...(section.sourceIds ? { sourceIds: section.sourceIds } : {}),
    }));
    result.sources = item.sources?.map((source) => ({
      id: source.id,
      title: source.title,
      citation: source.citation,
      url: source.url,
    }));
    for (const field of [
      "slug",
      "title",
      "category",
      "excerpt",
      "description",
      "standfirst",
      "publishedAt",
      "jurisdiction",
      "qualifications",
      "disclaimer",
    ])
      if (typeof result[field] !== "string" || !result[field].trim())
        throw new Error("Incomplete publication");
    if (
      typeof result.indexable !== "boolean" ||
      !Array.isArray(result.sections) ||
      result.sections.some(
        (section) =>
          typeof section.title !== "string" ||
          !section.title.trim() ||
          !Array.isArray(section.paragraphs) ||
          !section.paragraphs.length ||
          section.paragraphs.some((p) => typeof p !== "string" || !p.trim()),
      )
    )
      throw new Error("Invalid publication structure");
    if (result.publishedAt > new Date().toISOString().slice(0, 10))
      throw new Error("Publication date is in the future");
    return result;
  });
  // Cross-record related links (including samples) are checked by the prerender step.
  validateArticles(clean.map(({ relatedSlugs, ...record }) => record));

  return clean;
}
