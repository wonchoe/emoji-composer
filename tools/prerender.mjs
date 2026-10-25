import { build } from "vite";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const serverDir = resolve(root, "seo-render");
await build({ configFile: resolve(root, "vite.config.ts"), build: {
  ssr: resolve(root, "demo/ssr.tsx"), outDir: serverDir, emptyOutDir: true,
  rollupOptions: { output: { entryFileNames: "render.mjs" } },
} });
const { render } = await import(pathToFileURL(resolve(serverDir, "render.mjs")).href);
const { html, structuredData } = render();
const target = resolve(root, "demo-dist/index.html");
const template = await readFile(target, "utf8");
const json = JSON.stringify(structuredData).replace(/</g, "\\u003c");
await writeFile(target, template.replace('<div id="root"></div>', `<div id="root">${html}</div>`).replace("</head>", `<script type="application/ld+json">${json}</script>\n</head>`));
console.log(`Prerendered ${html.length.toLocaleString("en-US")} characters of visible HTML.`);
