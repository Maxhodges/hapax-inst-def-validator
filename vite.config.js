import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { readFileSync } from "fs";

const packageJson = JSON.parse(readFileSync("./package.json", "utf-8"));

export default defineConfig({
  plugins: [svelte()],
  css: {
    postcss: "./postcss.config.cjs",
  },
  build: {
    outDir: "dist",
  },
  publicDir: "public", // Serve static files from public
  define: {
    "import.meta.env.PACKAGE_VERSION": JSON.stringify(packageJson.version),
  },
});
