const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':

      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('File does not exist');
        return;
      }

      if (fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end('File already exists');
        return;
      }

      const writeStream = fs.createWriteStream(filepath);
      const limitStream = new LimitSizeStream({limit: 1024 * 1024});

      req.pipe(limitStream).pipe(writeStream);

      limitStream.on('error', () => {
        if (fs.existsSync(filepath)) {
          fs.unlink(filepath, (e) => {
            res.statusCode = 413;
            res.end('File limited to 1MB');
          });
        }
      });

      req.on('aborted', () => {
        writeStream.destroy();
        fs.unlink(filepath, () => {});
      });

      req.on('end', () => {
        res.statusCode = 201;
        res.end();
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
