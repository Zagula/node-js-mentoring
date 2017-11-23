'use strict';

import mongoose from 'mongoose';

export default mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    country: String,
    capital: Boolean,
    location: {
        lat: {
            type: Number,
            min: -90,
            max: 90
        },
        long: {
            type: Number,
            min: -180,
            max: 180
        }
    },
    lastModifiedDate: Date
});