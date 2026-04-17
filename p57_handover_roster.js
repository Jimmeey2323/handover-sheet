const http = require('http');
const fs = require('fs');
const path = require('path');

const HOST = process.env.HOST || '127.0.0.1';
const PORT = Number(process.env.PORT) || 3000;
const htmlFilePath = path.join(__dirname, 'p57_handover_roster.html');

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

function sendFile(filePath, response) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      if (error.code === 'ENOENT') {
        response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        response.end('404 Not Found');
        return;
      }

      response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('500 Internal Server Error');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    response.writeHead(200, {
      'Content-Type': contentTypes[ext] || 'application/octet-stream'
    });
    response.end(data);
  });
}

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host || `${HOST}:${PORT}`}`);
  const pathname = decodeURIComponent(requestUrl.pathname);

  if (pathname === '/' || pathname === '/p57_handover_roster') {
    sendFile(htmlFilePath, response);
    return;
  }

  const safePath = path.normalize(path.join(__dirname, pathname));

  if (!safePath.startsWith(__dirname)) {
    response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('403 Forbidden');
    return;
  }

  sendFile(safePath, response);
});

server.listen(PORT, HOST, () => {
  console.log(`57 Physique handover roster is running at http://${HOST}:${PORT}`);
});
