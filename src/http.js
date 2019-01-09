
const http = require('http');

const server = http.createServer();

server.listen(3000);

server.on('request', (request, response) => {
  request.on('error', (err) => {
    // This prints the error message and stack trace to `stderr`.
    console.error(err.stack);
    response.statusCode = 400;
    response.end();
  });

  response.on('error', (err) => {
    console.error(err);
  });

  if (request.method === 'GET') {
    if (request.url === '/search') {
      response.statusCode = 200;
      response.end();
    } else {
      response.statusCode = 404;
      response.end();
    }
  } else if (request.method === 'POST') {
    if (request.url === '/entities') {
      let body = [];
      request.on('data', (chunk) => {
        body.push(chunk);
      }).on('end', () => {
        body = Buffer.concat(body).toString();
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.end(body);
      });
    // } else if (request.url === '/entities-pipe-impl') {
    //   request.pipe(response);
     } else {
      response.statusCode = 404;
      response.end();
    }
  } else if (request.method === 'PUT') {
    if (request.url === '/entities') {
      let body = [];
      request.on('data', (chunk) => {
        body.push(chunk);
      }).on('end', () => {
        body = Buffer.concat(body).toString();
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.end(body);
      });
    } else {
      response.statusCode = 404;
      response.end();
    }
  } else if (request.method === 'DELETE') {
    if (request.url === '/entities') {
      let body = [];
      request.on('data', (chunk) => {
        body.push(chunk);
      }).on('end', () => {
        body = Buffer.concat(body).toString();
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.end(body);
      });
    } else {
      response.statusCode = 404;
      response.end();
    }
  } else {
    response.statusCode = 404;
    response.end();
  }
});

module.exports = server;