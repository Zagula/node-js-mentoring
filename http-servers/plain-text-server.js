'use strict';

import http from 'http';

const port = process.env.PORT || 8000;
const app = http.createServer();
app.on('request', (requset, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    response.end('Hello world');
}).listen(port, () => { console.log(`App listening on port ${port}!`) });