import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // The owner has approved launch. Only Vercel production or an explicit
  // local production check enables indexing; branch previews stay unindexed.
  const indexable =
    env.VERCEL_ENV !== "preview" &&
    (env.VERCEL_ENV === "production" || env.VITE_SITE_MODE === "production");

  return {
    plugins: [react()],
    define: { __SITE_IS_PRODUCTION__: JSON.stringify(indexable) },
    server: { host: "0.0.0.0", port: 5173 },
    build: {
      target: "es2022",
      sourcemap: false,
      cssCodeSplit: true,
    },
  };
});
