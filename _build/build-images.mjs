import * as fs from "fs";
import sharp from "sharp";

const EX = "_extract/final";
const OUTP = "assets/img/products";
const OUTH = "assets/img/hero";
fs.mkdirSync(OUTP, { recursive: true });
fs.mkdirSync(OUTH, { recursive: true });

const data = JSON.parse(fs.readFileSync("_build/products.json", "utf8"));

// ---- Products: trim, pad to square-ish, export webp (alpha) + jpg (white) ----
let missing = [];
for (const p of data.products) {
  const srcFile = `${EX}/${p.src}.png`;
  if (!fs.existsSync(srcFile)) { missing.push(p.id + " <- " + p.src); continue; }
  // trim any residual transparent border, then contain in padded square canvas
  const trimmed = await sharp(srcFile).trim({ threshold: 1 }).toBuffer();
  const base = sharp(trimmed).resize(1000, 1000, { fit: "inside", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({ top: 40, bottom: 40, left: 40, right: 40, background: { r: 0, g: 0, b: 0, alpha: 0 } });
  const alphaBuf = await base.clone().png().toBuffer();
  await sharp(alphaBuf).resize(880, 880, { fit: "inside" }).webp({ quality: 82 }).toFile(`${OUTP}/${p.id}.webp`);
  await sharp(alphaBuf).flatten({ background: "#ffffff" }).resize(880, 880, { fit: "inside" }).jpeg({ quality: 84, progressive: true }).toFile(`${OUTP}/${p.id}.jpg`);
}
console.log("products done. missing:", missing.length, missing.join(", "));

// ---- Hero banners: crop a landscape slice from the top of each divider photo ----
// (bottom ~30% often carries baked category text, so bias the crop upward)
const heroMap = {};
for (const c of data.categories) heroMap[c.hero] = c.slug;
heroMap["p05_01"] = heroMap["p05_01"] || "home"; // decorativas also used as home hero source

for (const [src, slug] of Object.entries(heroMap)) {
  const f = `${EX}/${src}.png`;
  if (!fs.existsSync(f)) { console.log("hero missing", src); continue; }
  const meta = await sharp(f).metadata();
  // take the top 66% of the image, full width, then center-crop to 16:9
  const cropH = Math.round(meta.height * 0.66);
  const slice = await sharp(f).extract({ left: 0, top: 0, width: meta.width, height: cropH }).flatten({ background: "#efe7db" }).toBuffer();
  await sharp(slice).resize(1600, 720, { fit: "cover", position: "top" }).webp({ quality: 80 }).toFile(`${OUTH}/${slug}.webp`);
  await sharp(slice).resize(1600, 720, { fit: "cover", position: "top" }).jpeg({ quality: 80, progressive: true }).toFile(`${OUTH}/${slug}.jpg`);
}

// dedicated tall home hero from decorativas lifestyle (p05)
{
  const f = `${EX}/p05_01.png`;
  const meta = await sharp(f).metadata();
  const cropH = Math.round(meta.height * 0.62);
  const slice = await sharp(f).extract({ left: 0, top: 0, width: meta.width, height: cropH }).flatten({ background: "#efe7db" }).toBuffer();
  await sharp(slice).resize(2000, 1500, { fit: "cover", position: "top" }).webp({ quality: 82 }).toFile(`${OUTH}/home.webp`);
  await sharp(slice).resize(2000, 1500, { fit: "cover", position: "top" }).jpeg({ quality: 82, progressive: true }).toFile(`${OUTH}/home.jpg`);
}
console.log("heroes done");
