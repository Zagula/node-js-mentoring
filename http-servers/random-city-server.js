'use strict';

import http from 'http';
import parseArgs from 'minimist';
import mongoose from '../modules/mongoDBService';
import citySchema from '../models/mongooseSchemas/city';
import cities from '../models/cities'

const argsArray = process.argv.slice(2);
const args = parseArgs(argsArray);

let City = mongoose.model("City", citySchema);

const port = process.env.PORT || 9000,
    app = http.createServer();

app.on('request', (requset, response) => {
    response.writeHead(200, {
        'Content-Type': 'application/json'
    });
    if (args.mongo) {
        City.aggregate({ $sample: { size: 1 } }).exec((err, data) => {
            if (err) throw err;
            response.end(JSON.stringify(data));
        });
    } else {
        response.end(JSON.stringify(cities[Math.floor(Math.random() * cities.length)]));
    }
}).listen(port, () => { console.log(`App listening on port ${port}!`) });