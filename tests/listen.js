'use strict';

const { Server } = require('../easyhttp');
const server = new Server(true)

server.route(
    'GET', '/',
    `${__dirname}/views/route1.html`,
    200
);

server.route(
    'GET', '/2',
    `${__dirname}/views/route2.html`,
    200
);

server.listen(8000);