import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // Search indexing is opt-in. Vercel Preview deployments cannot enable it.
  const indexable =
    env.VITE_SITE_MODE === "production" && env.VERCEL_ENV !== "preview";

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
