'use strict';

import http from 'http';
import products from '../models/products';

const port = process.env.PORT || 8000,
    app = http.createServer();

/*
const product = {
    id: 2,
    name: "Supreme T-Shirt",
    brand: "Supreme",
    price: 99.99,
    options: [
        { color: "blue" },
        { size: "XL" }
    ]
}
*/
const product = products[0]; // has been replaced during implementing exercise number 8

app.on('request', (requset, response) => {
    response.writeHead(200, {
        'Content-Type': 'application/json'
    });
    response.end(JSON.stringify(product));
}).listen(port, () => { console.log(`App listening on port ${port}!`) });