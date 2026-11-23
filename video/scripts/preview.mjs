// Uso: node scripts/preview.mjs 30 120 250 ...   (frames) → out/preview/frame-<n>.png
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const frames = process.argv.slice(2).map(Number);
const entry = path.resolve("src/index.ts");
const browserExecutable = process.env.REMOTION_BROWSER || undefined;
const serveUrl = await bundle({ entryPoint: entry });
const comp = await selectComposition({ serveUrl, id: "Video", browserExecutable });
fs.mkdirSync("out/preview", { recursive: true });
for (const f of frames) {
  await renderStill({ composition: comp, serveUrl, frame: f, output: `out/preview/frame-${f}.png`, browserExecutable, scale: 0.5 });
  console.log("ok", f);
}
