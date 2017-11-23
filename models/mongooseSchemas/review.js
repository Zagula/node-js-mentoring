'use strict';

import mongoose from 'mongoose';

export default mongoose.Schema({
    productId: String,
    userId: String,
    review: {
        type: String,
        validate: {
            validator: value => true,
            message: "never shows. {VALUE}"
        }
    }
});