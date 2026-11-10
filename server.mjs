import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), 'dist');
const port = Number(process.env.PORT || 3000);
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.xml':'application/xml','.txt':'text/plain; charset=utf-8','.pdf':'application/pdf','.webmanifest':'application/manifest+json'};

const server = http.createServer(async (req,res) => {
  try {
    const urlPath = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    let relative = normalize(urlPath).replace(/^(\.\.(\/|\\|$))+/, '').replace(/^[/\\]+/, '');
    let file = join(root,relative);
    if (!file.startsWith(root)) throw new Error('Invalid path');
    try { const info = await stat(file); if (info.isDirectory()) file = join(file,'index.html'); }
    catch { file = join(root,relative,'index.html'); }
    let body;
    try { body = await readFile(file); }
    catch { file = join(root,'404.html'); body = await readFile(file); res.statusCode = 404; }
    res.setHeader('Content-Type',mime[extname(file)] || 'application/octet-stream');
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Cache-Control',extname(file)==='.html'?'no-cache':'public, max-age=3600');
    res.end(body);
  } catch (error) {
    res.statusCode = 500;
    res.setHeader('Content-Type','text/plain; charset=utf-8');
    res.end('Unable to load this page. Run npm run build first.');
  }
});
server.listen(port,'0.0.0.0',()=>console.log(`National Global Academy running at http://0.0.0.0:${port}`));
