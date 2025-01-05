import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte()],
  css: {
    postcss: "./postcss.config.cjs",
  },
  build: {
    outDir: "dist",
  },
  publicDir: "public", // Serve static files from public
});
