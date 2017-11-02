'use strict';

import express from 'express';
import stream from 'stream';
import fs from 'fs';
import parsedCookies from './middlewares/parsedCookies';
import parsedQuery from './middlewares/parsedQuery';
import products from './models/products';
import users from './models/users';
import reviews from './models/reviews';

const app = express();
const router = express.Router();

app.use(express.json());
app.use(parsedCookies);
app.use(parsedQuery);

app.get('/cookie', (request, response) => {
    response.json(response.parsedCookies);
})
app.get('/query', (request, response) => {
    response.json(response.parsedQuery)
});

let productId = products[products.length - 1].id,
    path = './models/products.json';

router.get('/products', (req, res) => {
    res.json(products);
}).get('/products/:id', (req, res) => {
    res.json(products.filter(product => parseInt(req.params.id) === product.id));
}).get('/products/:id/reviews', (req, res) => {
    res.json(reviews.filter(review => review.productId == parseInt(req.params.id)));
}).post('/products', (req, res) => {
    let data = res.parsedQuery;
    let newProduct = {
        id: ++productId,
        name: data.name || "Noname",
        brand: data.brand || "Noname",
        price: parseFloat(data.price) || 0,
        options: {
            color: data.color || 'none',
            size: data.size || 'none'
        }
    }
    products.push(newProduct);
    let reader = stream.Readable();
    let writer = fs.createWriteStream(path);
    reader.push(JSON.stringify(products));
    reader.push(null);
    reader.pipe(writer);
    res.json(newProduct);
}).get('/users', (req, res) => {
    res.json(users);
})

app.use('/api', router);

export default app;