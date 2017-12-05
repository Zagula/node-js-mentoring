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
import Sequelize from 'sequelize';
import seqConfig from './database/sequelize/config';
import seqUser from './database/sequelize/models/user';
import seqProduct from './database/sequelize/models/product';
import seqProductOptions from './database/sequelize/models/productoptions';

import parsedCookies from './middlewares/parsedCookies';
import parsedQuery from './middlewares/parsedQuery';
import checkToken from './middlewares/checkToken';

import products from './models/products';
import users from './models/users';
import reviews from './models/reviews';

import creds from './config/creds';

const app = express();
const router = express.Router();

const env = 'development';
const sequelize = new Sequelize(seqConfig[env].database, seqConfig[env].username, seqConfig[env].password, {
    host: seqConfig[env].host,
    dialect: seqConfig[env].dialect,
    logging: false
});

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


const User = seqUser(sequelize, Sequelize),
    Product = seqProduct(sequelize, Sequelize),
    ProductOptions = seqProductOptions(sequelize, Sequelize);

Product.hasOne(ProductOptions, { foreignKey: 'productId' });

router
    .get('/products', (req, res) => {
        Product.findAll({
            include: ProductOptions
        }).then((data) => {
            res.json(data)
        });
    })
    .get('/products/:id', (req, res) => {
        Product.findById(req.params.id, {
            include: ProductOptions
        }).then((data) => {
            res.json(data)
        });
    })
    .post('/products', (req, res) => {
        let data = req.body;
        Product.create(data, {
            attributes: ['name', 'brand', 'price']
        }).then(product => {
            ProductOptions.create(Object.assign({productId: product.id}, data.options),
            {
                attributes: ['size', 'color', 'productId']
            }).then(() => {
                Product.findById(product.id, {
                    include: ProductOptions
                }).then((data) => {
                    res.json(data)
                });
            });
        });
    })
    .get('/users', (req, res) => {
        Product.findAll().then((data) => {
            res.json(data)
        });
    })

app.use('/api', checkToken, router);

export default app;