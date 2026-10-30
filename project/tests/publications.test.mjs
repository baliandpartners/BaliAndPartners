import { test } from "node:test";
import assert from "node:assert/strict";
import { publicRecords } from "../scripts/publication-records.mjs";
const item = {
  slug: "test-only",
  title: "Fixture",
  category: "Test",
  tags: ["Example"],
  excerpt: "Fixture",
  description: "Fixture",
  standfirst: "Fixture",
  kind: "publication",
  label: "Legal perspective",
  approved: true,
  publishedAt: "2026-10-24",
  jurisdiction: "Test only",
  qualifications: "Fixture",
  disclaimer: "Not published",
  indexable: false,
  author: { name: "Test author", privateEmail: "do-not-publish@example.test" },
  sections: [
    {
      id: "scope",
      title: "Scope",
      paragraphs: ["Test only."],
      internalNotes: "private",
    },
  ],
  sources: [
    {
      id: "source",
      title: "Fixture",
      citation: "Fixture source",
      url: "https://example.test/source",
      reviewer: "private",
    },
  ],
  internal_notes: "secret",
  service_key: "secret",
};
test("publishing exports only allowlisted public fields and fails closed for invalid records", () => {
  const result = publicRecords([
    {
      document: item,
      editorial_owner: "Private owner",
      reviewed_by: "Private reviewer",
    },
  ]);
  assert.equal(result.length, 1);
  assert.equal(JSON.stringify(result).includes("secret"), false);
  assert.equal(JSON.stringify(result).includes("private"), false);
  assert.equal(JSON.stringify(result).includes("Private"), false);
  for (const override of [
    { approved: false },
    { kind: "sample" },
    { sources: [] },
    { publishedAt: "2099-01-01" },
    { publishedAt: "2026-02-30" },
    { tags: ["x".repeat(41)] },
    { sections: [{ id: "scope", title: "Scope", paragraphs: [] }] },
    { sources: [{ ...item.sources[0], url: "javascript:alert(1)" }] },
  ])
    assert.throws(() =>
      publicRecords([{ document: { ...item, ...override } }]),
    );
  assert.deepEqual(publicRecords([]), []);
});
