'use strict';

import http from 'http';

const port = process.env.PORT || 8000,
    app = http.createServer();

app.on('request', (request, response) => {
    request.pipe(response);
}).listen(port, () => { console.log(`App listening on port ${port}!`) });