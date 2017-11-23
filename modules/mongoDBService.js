'use strict';

import mongoose from 'mongoose';

const CURRENT_DB = 'mydb';

mongoose.connect(`mongodb://localhost/${CURRENT_DB}`, {
    useMongoClient: true
});
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db
    .on('error', (err) => {
        console.log(err)
    })
    .on('open', () => {
        console.log(`Successfully connected to database: ${CURRENT_DB}`)
    });

export default mongoose;