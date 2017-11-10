'use strict';

import express from 'express';
import session from 'express-session';
import stream from 'stream';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import FacebookStrategy from 'passport-facebook';
//import TwitterStrategy from 'passport-twitter';
//import GoogleStrategy from 'passport-google-oauth';

import parsedCookies from './middlewares/parsedCookies';
import parsedQuery from './middlewares/parsedQuery';
import checkToken from './middlewares/checkToken';

import products from './models/products';
import users from './models/users';
import reviews from './models/reviews';

import creds from './config/creds';

const app = express();
const router = express.Router();

app.use(express.json());
app.use(parsedCookies);
app.use(parsedQuery);
// app.use(session({
//     secret: 'secret',
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         secure: true
//     }
// }));
// app.use(passport.initialize());
// app.use(passport.session());
// passport.serializeUser(function(user, cb) {
//     cb(null, user);
// });
// passport.deserializeUser(function(obj, cb) {
//     cb(null, obj);
// });

let productId = products[products.length - 1].id,
    path = './models/products.json';

passport.use(new LocalStrategy({
    usernameField: 'login',
    passwordField: 'password',
    session: false
}, (username, password, done) => {
    if (username == creds.login && password == creds.password) {
        done(null, creds);
    } else {
        done(null, false, 'Wrong');
    }
}));
passport.use(new FacebookStrategy({
    clientID: "252598088602754",
    clientSecret: '803d4d5f32e3a7368e0966b647aabae2',
    callbackURL: "http://localhost:8000/auth/facebook/callback"
}, (accessToken, refreshToken, profile, cb) => {
    return cb(null, profile);
}));
// passport.use(new TwitterStrategy({
//     consumerKey: 'kNU0RQGZ6nU5cwFKppqizXVqU',
//     consumerSecret: 'Bu1qK4kQXOsR7NkWhJuZppKjoekCx42Wh1hfNQAVDWaVoFoTS2',
//     callbackURL: "http://localhost/auth/twitter/callback"
// }, (token, tokenSecret, profile, done) => {
//     console.dir(profile)
//     return done(null, profile);
// }));

app.get('/cookie', (request, response) => {
    response.json(response.parsedCookies);
})
app.get('/query', (request, response) => {
    response.json(response.parsedQuery)
});
app.post('/auth', passport.authenticate('local', { session: false }), (req, res) => {
    let { password, login } = req.user;
    if (password === creds.password && login === creds.login ) {
        let token = jwt.sign(creds, "secret", { expiresIn: 100 });
        res.setHeader("x-access-token", token);
        res.json({
            code: 200,
            message: "OK",
            data: {
                user: {
                    email: "mail@yandex.ru",
                    username: "Andrew"
                }
            },
            token: token
        });
    } else {
        res.json({
            code: 404,
            message: "Not Found",
            data: {}
        })
    }

});
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirecrt: '/auth'
}));
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    successRedirect: '/',
    failureRedirecrt: '/auth'
}));

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

app.use('/api', checkToken, router);

export default app;