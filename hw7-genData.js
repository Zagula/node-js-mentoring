'use strict';

import mongoose from './modules/mongoDBService';

import userSchema from './models/mongooseSchemas/user';
import productSchema from './models/mongooseSchemas/product';
import reviewSchema from './models/mongooseSchemas/review';
import citySchema from './models/mongooseSchemas/city';

import cities from './models/cities';
import users from './models/users';
import products from './models/products';
import reviews from './models/reviews';

const City = mongoose.model("City", citySchema);
const User = mongoose.model("User", userSchema);
const Product = mongoose.model("Product", productSchema);
const Review = mongoose.model("Review", reviewSchema);

City.collection.drop();
User.collection.drop();
Product.collection.drop();
Review.collection.drop();

City.insertMany(cities);
Promise.all([
    User.insertMany(users),
    Product.insertMany(products)
]).then((data) => {
    let [userIDs, productIDs] = data,
        generateReviews = reviews.map(review => {
            let userIDNum = Math.floor(Math.random() * userIDs.length),
                productIDNum = Math.floor(Math.random() * productIDs.length);
            return {
                review: review.review,
                userId: userIDs[userIDNum]._id,
                productId: productIDs[productIDNum]._id,
            }
        })
    Review.insertMany(generateReviews);
}, (err) => { throw err })