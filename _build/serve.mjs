import http from "http";
import fs from "fs";
import path from "path";
const root = path.resolve(".");
const PORT = 5057;
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".xml": "application/xml", ".txt": "text/plain", ".ico": "image/x-icon" };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p === "/") p = "/index.html";
  let file = path.join(root, p);
  if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) {
      const nf = path.join(root, "404.html");
      fs.readFile(nf, (e, b) => { res.writeHead(404, { "Content-Type": types[".html"] }).end(b || "Not found"); });
      return;
    }
    res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  });
}).listen(PORT, () => console.log("Rilape dev server → http://localhost:" + PORT));
