'use strict';

export default function parsedCookies(request, response, next) {
    let cookie = {};
    let param = request.rawHeaders[request.rawHeaders.indexOf('Cookie') + 1];
    param.split(/;\s*/).map((item) => {
        let obj = item.split('=');
        cookie[obj[0]] = obj[1];
    });
    response.parsedCookies = cookie;
    next();
}