// ===== KONFIGURATION =====
const PORT = 3000;

const FILES = [
  "index.html",
  "style.css",
  "script.js",
  "images",     // Ordner erlaubt
  "assets"      // Ordner erlaubt
];
// =========================

const http = require("http");
const fs = require("fs");
const path = require("path");

// MIME-Typen erweitert
const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".ico": "image/x-icon"
};

// 🔒 nur Dateien/Ordner aus FILES erlauben
function isAllowed(requestPath) {
  return FILES.some(f =>
    requestPath === f || requestPath.startsWith(f + "/")
  );
}

const server = http.createServer((req, res) => {
  let requestPath = req.url === "/" ? "index.html" : req.url.slice(1);

  // Sicherheit: ../ entfernen
  requestPath = path.normalize(requestPath).replace(/^(\.\.[\/\\])+/, "");

  if (!isAllowed(requestPath)) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 - Datei nicht erlaubt");
    return;
  }

  const fullPath = path.join(__dirname, requestPath);

  fs.stat(fullPath, (err, stats) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 - Nicht gefunden");
      return;
    }

    // 📁 Ordner → index.html darin senden
    if (stats.isDirectory()) {
      const indexFile = path.join(fullPath, "index.html");
      fs.readFile(indexFile, (err, data) => {
        if (err) {
          res.writeHead(403, { "Content-Type": "text/plain" });
          res.end("Kein index.html im Ordner");
          return;
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      });
      return;
    }

    // 📄 Datei senden (auch Bilder!)
    const ext = path.extname(fullPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    fs.readFile(fullPath, (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Serverfehler");
        return;
      }

      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
