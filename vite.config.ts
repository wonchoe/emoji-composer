import { createReadStream, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const packageRoot = dirname(fileURLToPath(import.meta.url));
const catalogRoot = resolve(packageRoot, "../emoji-catalog");
const stagedAssetRoot = resolve(
  process.env.EMOJI_ASSET_ROOT || "D:/EmojiCatalogRelease/v2.0.0/assets/png",
);

function localEmojiAssets(): Plugin {
  return {
    name: "local-emoji-assets",
    configureServer(server) {
      server.middlewares.use("/_emoji-assets", (request, response, next) => {
        const path = decodeURIComponent((request.url ?? "/").split("?", 1)[0]);
        const match = /^\/(16|24|32|64|128|256|512|1024)\/((?:(?:skin|fix|clean2)-)?[0-9a-f-]+\.png)$/i.exec(path);
        if (!match) return next();

        const [, size, filename] = match;
        const isTone = filename.startsWith("skin-");
        const staged = resolve(stagedAssetRoot, size, filename);
        const catalogSource = isTone
          ? resolve(catalogRoot, "skin-tone-generated/reviewed/images", filename)
          : resolve(catalogRoot, "images", filename);
        const source = staged.startsWith(stagedAssetRoot) && existsSync(staged)
          ? staged
          : catalogSource;
        if (
          (source === staged && !source.startsWith(stagedAssetRoot)) ||
          (source === catalogSource && !source.startsWith(catalogRoot)) ||
          !existsSync(source)
        ) {
          response.statusCode = 404;
          response.end("Emoji asset not found");
          return;
        }

        response.setHeader("Content-Type", "image/png");
        response.setHeader("Cache-Control", "no-store");
        createReadStream(source).pipe(response);
      });
    },
  };
}

export default defineConfig({
  root: resolve(packageRoot, "demo"),
  plugins: [react(), localEmojiAssets()],
  server: { host: "0.0.0.0" },
  build: { outDir: resolve(packageRoot, "demo-dist"), emptyOutDir: true },
});
