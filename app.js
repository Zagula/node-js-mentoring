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
import mongoose from './modules/mongoDBService';

import parsedCookies from './middlewares/parsedCookies';
import parsedQuery from './middlewares/parsedQuery';
import checkToken from './middlewares/checkToken';

import products from './models/products';
import users from './models/users';
import reviews from './models/reviews';

import productSchema from './models/mongooseSchemas/product';
import reviewSchema from './models/mongooseSchemas/review';
import userSchema from './models/mongooseSchemas/user';
import citySchema from './models/mongooseSchemas/city';

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

const Product = mongoose.model("Product", productSchema);
const Review = mongoose.model("Review", reviewSchema);
const User = mongoose.model("User", userSchema);
const City = mongoose.model("City", citySchema);
router
    .all('/*', (req, res, next) => {
        if (req.method.match(/^(POST|PUT)$/i)) {
            req.lastModifiedDate = new Date();
        }
        next();
    })
    .get('/products', (req, res) => {
        Product.find((err, data) => {
            if (err) throw err;
            res.json(data)
        })
    })
    .get('/products/:id', (req, res) => {
        Product.find({_id: req.params.id}, (err, data) => {
            res.json(data);
        });
    })
    .get('/products/:id/reviews', (req, res) => {
        Review.find({productId: req.params.id}, (err, data) => {
            if (err) throw err;
            res.json(data);
        });
    })
    .post('/products', (req, res) => {
        let data = res.parsedQuery;
        if (req.lastModifiedDate) {
            data.lastModifiedDate = req.lastModifiedDate;
        }
        data.options = {};
        data.options.color = data.color;
        data.options.size = data.size;
        Product.create(data, (err, data) => {
            if (err) {
                res.end(err.message);
                return;
            }
            res.json(data);
        });
    })
    .get('/users', (req, res) => {
        User.find((err, data) => {
            if (err) throw err;
            res.json(data);
        })
    })
    .delete('/users/:id', (req, res) => {
        User.remove({_id: req.params.id}, (err, data) => {
            if (err) {
                res.end('Wrong ID');
                return
            }
            if (data.result.n) {
                res.end('User deleted successfully');
                return
            }
            res.end('User was not found')
        })
    })
    .delete('/products/:id', (req, res) => {
        Product.remove({_id: req.params.id}, (err, data) => {
            if (err) {
                res.end('Wrong ID');
                return
            }
            if (data.result.n) {
                res.end('Product deleted successfully');
                return
            }
            res.end('Product was not found')
        })
    })
    .get('/cities', (req, res) => {
        City.find((err, data) => {
            if (err) throw err;
            res.json(data);
        })
    })
    .post('/cities', (req, res) => {
        let data = res.parsedQuery;
        if (req.lastModifiedDate) {
            data.lastModifiedDate = req.lastModifiedDate;
        }
        data.location = {};
        data.location.lat = data.lat;
        data.location.long = data.long;
        City.create(data, (err, data) => {
            if (err) {
                res.end(err.message);
                return;
            }
            res.json(data);
        })
    })
    .put('/cities/:id', (req, res) => {
        let data = res.parsedQuery;
        if (req.lastModifiedDate) {
            data.lastModifiedDate = req.lastModifiedDate;
        }
        if (data.lat || data.long) data.location = {};
        if (data.lat) data.location.lat = data.lat;
        if (data.long) data.location.long = data.long;
        City.findByIdAndUpdate(req.params.id, { $set: data }, { new: true }, (err, city) => {
            if (err) throw err;
            if (city) res.json(city);
            else {
                City.create(data, (err, data) => {
                    if (err) {
                        res.end(err.message);
                        return;
                    }
                    res.json(data);
                });
            }
        });
    })
    .delete('/cities/:id', (req, res) => {
        City.remove({_id: req.params.id}, (err, data) => {
            if (err) {
                res.end('Wrong ID');
                return
            }
            if (data.result.n) {
                res.end('City deleted successfully');
                return
            }
            res.end('City was not found')
        })
    })

app.use('/api', checkToken, router);

export default app;