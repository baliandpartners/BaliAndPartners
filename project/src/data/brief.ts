export const briefOptions = {
  profession: [
    "Law firm",
    "Partner or senior advocate",
    "Chambers",
    "Legal publisher",
    "In-house legal team",
    "Other professional team",
  ],
  scope: [
    "A defined document or question",
    "A series of related pieces",
    "An existing content library",
    "Help defining the brief",
  ],
  engagement: ["One-off assignment", "Recurring support"],
  volume: [
    "One piece or research note",
    "2–5 pieces",
    "6 or more pieces",
    "To be agreed",
  ],
  timeline: [
    "Within two weeks",
    "Within a month",
    "Over the next quarter",
    "Flexible / to be agreed",
  ],
} as const;
export type BriefField = keyof typeof briefOptions;
export type ProjectBrief = Record<BriefField, string>;
export const emptyBrief: ProjectBrief = {
  profession: "",
  scope: "",
  engagement: "",
  volume: "",
  timeline: "",
};
export const briefLabels: Record<BriefField, string> = {
  profession: "Your professional category",
  scope: "Approximate scope",
  engagement: "Assignment type",
  volume: "Anticipated volume",
  timeline: "Preferred timeline",
};
export function validBrief(value: unknown): value is ProjectBrief {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  return (
    Object.keys(record).length === 5 &&
    Object.entries(briefOptions).every(
      ([key, options]) =>
        typeof record[key] === "string" &&
        (options as readonly string[]).includes(record[key] as string),
    )
  );
}
