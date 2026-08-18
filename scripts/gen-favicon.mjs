// Generates the favicon from the LO.oz wordmark spec.
//
// Design source of truth: src/components/Wordmark.tsx + DESIGN.md. The mark is
// "LO.oz" in Fraunces on parchment; the dot is the only colour in the name and
// wears the ink ring that .wm-dot draws in CSS (here a stroke with
// paint-order="stroke", the SVG way to outline without eating the fill).
//
// Emits:
//   src/app/favicon.ico  — legacy multi-res ico (16/32/48), replaced by this
//   src/app/icon.svg     — modern vector favicon Next.js serves as <link rel=icon>
//   public/apple-touch-icon.png — iOS home-screen icon (180px, no transparency)
//
// Font: Fraunces is embedded as base64 into the SVG used for rasterising so the
// ico is correct even on machines without the font installed. The icon.svg
// favicon instead references the real self-hosted woff2 by URL, so browsers
// load true Fraunces at no extra cost (fallback Georgia).
//
// Run:  node scripts/gen-favicon.mjs
// Verify visually (this script only checks ink coverage): open /favicon.ico
// and /icon.svg in a browser tab.
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FONT = path.join(root, "src/app/fonts/fraunces/fraunces-variable.woff2");

const INK = "#221E17";
const PARCHMENT = "#F5EEDF";
const OCHRE = "#E8A12C";

const WORDMARK = (fontFamily, fontUrl) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <style>
    ${fontUrl ? `@font-face{font-family:'Fraunces';src:url(${fontUrl}) format('woff2');font-weight:400 900;}` : ""}
  </style>
  <rect width="512" height="512" fill="${PARCHMENT}"/>
  <text x="256" y="344" text-anchor="middle" font-family="Fraunces, Georgia, 'Times New Roman', serif"
        font-weight="600" font-size="232" fill="${INK}" letter-spacing="-0.02em">
    <tspan>LO</tspan>
    <tspan font-size="1.2em" fill="${OCHRE}" stroke="${INK}" stroke-width="10" paint-order="stroke">.</tspan>
    <tspan>oz</tspan>
  </text>
</svg>`;

function icoBytes(pngs) {
  // ICO container with PNG-compressed frames (supported by every modern
  // browser and Windows). Three frames: 16, 32, 48.
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  const entries = Buffer.alloc(16 * pngs.length);
  let offset = 6 + entries.length;
  for (let i = 0; i < pngs.length; i++) {
    const png = pngs[i];
    const e = entries.subarray(i * 16, (i + 1) * 16);
    e.writeUInt8(png.w, 0); // 0 = 256 for the ico spec; png.w>255 is impossible here
    e.writeUInt8(png.w, 1);
    e.writeUInt8(0, 2); // colour palette
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // planes
    e.writeUInt16LE(32, 6); // bpp
    e.writeUInt32LE(png.buf.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += png.buf.length;
  }
  return Buffer.concat([header, entries, ...pngs.map((p) => p.buf)]);
}

const fontB64 = fs.readFileSync(FONT).toString("base64");
const rasterSvg = WORDMARK("Fraunces", `data:font/woff2;base64,${fontB64}`);

// Rasterise once at 256, downscale for the ico frames (cheaper than rendering
// the text 3× and identical visually).
const big = await sharp(Buffer.from(rasterSvg)).resize(256, 256).png().toBuffer();

const sizes = [16, 32, 48];
const pngs = [];
for (const s of sizes) {
  const buf = await sharp(big).resize(s, s).png().toBuffer();
  pngs.push({ w: s, buf });
}
fs.writeFileSync(path.join(root, "src/app/favicon.ico"), icoBytes(pngs));
console.log("src/app/favicon.ico", icoBytes(pngs).length, "bytes");

// Vector favicon: reference the real self-hosted font by URL so the browser
// resolves true Fraunces with no base64 bloat.
fs.writeFileSync(
  path.join(root, "src/app/icon.svg"),
  WORDMARK("Fraunces", "'/fonts/fraunces/fraunces-variable.woff2'"),
);
console.log("src/app/icon.svg", fs.statSync(path.join(root, "src/app/icon.svg")).size, "bytes");

// iOS home-screen icon: 180px PNG, opaque so it does not flatten to a black
// square when iOS applies its background. Named per the Next file convention
// (src/app/apple-icon.png) so <link rel="apple-touch-icon"> is emitted for free.
const apple = await sharp(Buffer.from(rasterSvg)).resize(180, 180).png().toBuffer();
fs.writeFileSync(path.join(root, "src/app/apple-icon.png"), apple);
console.log("src/app/apple-icon.png", apple.length, "bytes");

// Sanity: the mark must actually be on the page. Count ink/ochre coverage on
// the 256px render; near-zero ink means the font failed and the text rendered
// blank.
const { data, info } = await sharp(big).raw().toBuffer({ resolveWithObject: true });
const px = info.width * info.height;
let ink = 0, ochre = 0;
for (let i = 0; i < data.length; i += info.channels) {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  if (r < 60 && g < 60 && b < 60) ink++;
  else if (r > 200 && g > 100 && g < 220 && b < 120) ochre++;
}
console.log(`sanity: ink ${(ink / px * 100).toFixed(2)}% ochre ${(ochre / px * 100).toFixed(2)}%`);
if (ink / px < 0.02 || ochre / px < 0.001) {
  console.error("FAIL: mark did not render (ink or ochre coverage too low)");
  process.exit(1);
}
console.log("ok");
