const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

http.createServer((req, res) => {
    let filePath = path.join(__dirname, req.url === '/' ? 'viewer.html' : req.url);
    let extname = path.extname(filePath);
    
    let contentType = 'text/html';
    switch (extname) {
        case '.json':
            contentType = 'application/json';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if(err.code == 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + err.code);
            }
        } else {
            // Add CORS headers just in case
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
}).listen(PORT, () => {
    console.log(`\n==========================================`);
    console.log(`Server lokal berjalan!`);
    console.log(`Silakan buka: http://localhost:${PORT}/viewer.html`);
    console.log(`==========================================\n`);
});
