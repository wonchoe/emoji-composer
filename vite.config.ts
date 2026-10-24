import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const packageRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: resolve(packageRoot, "demo"),
  plugins: [react()],
  server: { host: "0.0.0.0" },
  build: { outDir: resolve(packageRoot, "demo-dist"), emptyOutDir: true },
});
