'use strict';

import jwt from 'jsonwebtoken';

export default function(request, response, next) {
    let token = request.headers['x-access-token'];

    if (token) {
        jwt.verify(token, 'secret', function(err, decoded) {
            if (err) {
                response.json({
                    success: false,
                    message: 'Failed to auth token'
                });
            } else {
                next();
            }
        })
    } else {
        response.status(403).send({
            success: false,
            message: 'No token provided'
        });
    }
}