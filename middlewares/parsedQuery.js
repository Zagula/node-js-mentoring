'use strict';

export default function parsedQuery(request, response, next) {
    response.parsedQuery = request.query;
    next();
}