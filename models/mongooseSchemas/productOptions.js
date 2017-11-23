'use strict';

import mongoose from 'mongoose';

export default mongoose.Schema({
    color: {
        type: String,
        default: 'not specified'
    },
    size: {
        type: String,
        default: 'not specified',
        enum: [
            '37', '38', '39', '40', '41', '42', '43', '44', '45',
            'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL',
            'not specified'
        ]
    }
});