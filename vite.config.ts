import { defineConfig } from "vite";
import ffncComponentTagger from "@dyad-sh/react-vite-component-tagger";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    ffncComponentTagger(),
    react(),
    // Copy everything under src/assets to dist/assets at build time.
    // Use a relative src with forward slashes so the plugin's glob matches on Windows.
    viteStaticCopy({
      targets: [
        {
          src: "src/assets/**/*",
          dest: "assets",
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
