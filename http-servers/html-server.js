'use strict';

import http from 'http';
import parseArgs from 'minimist';
import fs from 'fs';
import replace from 'stream-replace';

const argsArray = process.argv.slice(2);
const args = parseArgs(argsArray);

const port = process.env.PORT || 8000,
    path = './http-servers/data/index.html',
    regexp = new RegExp('{message}', 'g'),
    message = 'Hello html world',
    app = http.createServer();

app.on('request', (requset, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    if (args.sync) {
        const file = fs.readFileSync(path, {encoding: 'utf-8'});
        response.end(file.replace(regexp, message));
    } else {
        const readable = fs.createReadStream(path);
        readable.pipe(replace(regexp, message)).pipe(response);
    }  
}).listen(port, () => { console.log(`App listening on port ${port}!`) });