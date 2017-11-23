'use strict';

import mongoose from 'mongoose';
import productOptionsSchema from './productOptions';

export default mongoose.Schema({
    name: {
        type: String,
        default: 'Noname',
        match: /jeans|shirt/i
    },
    brand: {
        type: String,
        default: 'Noname'
    },
    price: {
        type: Number,
        default: 0
    },
    options: productOptionsSchema,
    lastModifiedDate: Date
});