const PORT = process.env.PORT || 3000;

const server = require('http').createServer();

const memberNsp = require('socket.io')(server, {
    path: '/member',
    serveClient: false,
    // below are engine.IO options
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
});

const teamNsp = require('socket.io')(server, {
    path: '/team',
    serveClient: false,
    // below are engine.IO options
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
});

const organizationNsp = require('socket.io')(server, {
    path: '/organization',
    serveClient: false,
    // below are engine.IO options
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
});

server.listen(PORT);