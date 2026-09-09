import { cp, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
const project = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const core = dirname(require.resolve("@ffmpeg/core"));
const wrapper = dirname(require.resolve("@ffmpeg/ffmpeg"));
const pdf = dirname(require.resolve("pdfjs-dist/package.json"));
const vendor = join(project, "public", "vendor");
await mkdir(vendor, { recursive: true });
// ESM wrapper workers import sibling files. Copy the complete ESM directory.
await cp(resolve(wrapper, "../esm"), join(vendor, "ffmpeg"), {
  recursive: true,
});
await cp(resolve(core, "../esm"), join(vendor, "ffmpeg-core"), {
  recursive: true,
});
for (const folder of ["cmaps", "standard_fonts", "wasm"]) {
  await cp(join(pdf, folder), join(vendor, "pdf", folder), { recursive: true });
}
console.log("Local FFmpeg and PDF.js assets copied to public/vendor.");
