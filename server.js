// ===== KONFIGURATION =====
const PORT = 3000;

const FILES = [
  "index.html"
];
// =========================

const http = require("http");
const fs = require("fs");
const path = require("path");

// einfache MIME-Typen
const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript"
};

const server = http.createServer((req, res) => {
  let fileName = req.url === "/" ? "index.html" : req.url.substring(1);

  // nur Dateien aus der Liste erlauben
  if (!FILES.includes(fileName)) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 - Datei nicht erlaubt oder nicht gefunden");
    return;
  }

  const filePath = path.join(__dirname, fileName);
  const ext = path.extname(fileName);
  const contentType = MIME_TYPES[ext] || "text/plain";

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Serverfehler");
      return;
    }

    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
