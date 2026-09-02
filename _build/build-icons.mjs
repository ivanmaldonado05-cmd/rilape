import * as fs from "fs";
import sharp from "sharp";

const svg = fs.readFileSync("assets/img/favicon.svg");
await sharp(svg, { density: 200 }).resize(32, 32).png().toFile("assets/img/favicon-32.png");
await sharp(svg, { density: 300 }).resize(180, 180).png().toFile("assets/img/apple-touch-icon.png");
await sharp(svg, { density: 400 }).resize(512, 512).png().toFile("assets/img/icon-512.png");

// OG image 1200x630 from home hero + gold logo + tagline
const logoSvg = fs.readFileSync("assets/img/logo/logo.svg").toString().replace(/currentColor/g, "#f2e4c6");
const logoPng = await sharp(Buffer.from(logoSvg), { density: 60, limitInputPixels: false }).resize(760).png().toBuffer();
const grad = Buffer.from(
  '<svg width="1200" height="630"><rect width="1200" height="630" fill="rgba(30,22,14,0.46)"/></svg>'
);
const tag = Buffer.from(
  '<svg width="1200" height="120"><style>text{font-family:Georgia,serif;fill:#f6efe1}</style>' +
  '<text x="600" y="70" text-anchor="middle" font-size="34" letter-spacing="6">LA PRIMERA FÁBRICA DE VELAS DEL PARAGUAY · DESDE 1981</text></svg>'
);
const base = await sharp("assets/img/hero/home.jpg").resize(1200, 630, { fit: "cover", position: "top" }).toBuffer();
await sharp(base)
  .composite([
    { input: grad, top: 0, left: 0 },
    { input: logoPng, left: 220, top: 150 },
    { input: tag, top: 470, left: 0 }
  ])
  .jpeg({ quality: 86 })
  .toFile("assets/img/og-image.jpg");
console.log("icons + og-image done");
