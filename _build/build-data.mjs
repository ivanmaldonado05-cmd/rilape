import * as fs from "fs";
const data = JSON.parse(fs.readFileSync("_build/products.json", "utf8"));
const out = {
  waNumber: "595986238556",
  categories: data.categories,
  products: data.products,
};
const js = "/* Generado desde _build/products.json — no editar a mano. */\n" +
  "window.RILAPE = " + JSON.stringify(out) + ";\n";
fs.writeFileSync("assets/js/data.js", js);
console.log("data.js:", data.products.length, "productos,", data.categories.length, "categorías,", (js.length / 1024).toFixed(1) + "KB");
