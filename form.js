const fs   = require('fs');
const http = require('http');
const db   = require('./db.js');

const server = http.createServer((req, res) => {
  if (req.method == 'GET') {
    fs.readFile('form.html', (err, content) => {
      res.setHeader('Content-Type', 'text/html');
      res.writeHead(200);
      res.end(content);
    });
  } else if (req.method == 'POST') {
    let body = '';
    req.on('data', piece => {
      body += piece.toString();
    });

    req.on('end', () => {
      let data = new URLSearchParams(body);
      if (
           !data.get('firstname') ||
           !data.get('lastname') ||
           !data.get('email') ||
           !data.get('number')
         ) {
        res.setHeader('Location', '/form.html?error=missing_fields');
        res.writeHead(302);
        res.end();
      } else {
        const stmt = db.prepare(`
          INSERT INTO form_submissions (firstname, lastname, email, number, time)
          VALUES (?, ?, ?, ?, ?);
        `);

        stmt.run(
          data.get('firstname'),
          data.get('lastname'),
          data.get('email'),
          data.get('number'),
          Date.now()
        );

        res.setHeader('Location', '/form.html?error=no_error');
        res.writeHead(302);
        res.end();
      }
    });
  } else {
    res.setHeader('Location', '/form.html?error=invalid_method');
    res.writeHead(302);
    res.end();
  }
});


// http://localhost:8080
server.listen(8080, () => {
  console.log('Server started');
});
