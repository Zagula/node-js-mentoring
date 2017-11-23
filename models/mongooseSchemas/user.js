'use strict';

import mongoose from 'mongoose';

export default mongoose.Schema({
    name: {
        type: String,
        maxlength: 30
    },
    age: {
        type: Number,
        min: 18,
        max: 120
    }
});