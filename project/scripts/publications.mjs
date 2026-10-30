import { writeFile } from "node:fs/promises";
import { publicRecords } from "./publication-records.mjs";
const output = new URL(
  "../src/data/publications.generated.json",
  import.meta.url,
);
const { SUPABASE_URL: url, SUPABASE_SECRET_KEY: key } = process.env;
if (!url || !key) {
  if (process.env.VERCEL_ENV === "production")
    throw new Error("Publication service configuration missing");
  await writeFile(output, "[]\n");
} else {
  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url))
    throw new Error("Invalid publication service URL");
  const response = await fetch(
    `${url}/rest/v1/publication_records?select=document&status=eq.published&rights_confirmed=eq.true&order=created_at.desc&limit=1000`,
    {
      headers: {
        apikey: key,
        ...(key.startsWith("sb_secret_")
          ? {}
          : { Authorization: `Bearer ${key}` }),
      },
      signal: AbortSignal.timeout(15000),
    },
  );
  if (!response.ok)
    throw new Error(
      "Could not load approved publications; existing deployment remains available",
    );
  const rows = await response.json();
  const clean = publicRecords(rows);
  await writeFile(output, JSON.stringify(clean));
  console.log(`Loaded ${clean.length} approved publications.`);
}
