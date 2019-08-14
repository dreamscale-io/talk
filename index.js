const PORT = process.env.PORT || 3000;

const server = require('http').createServer();

const io = require('socket.io')(server, {
    path: '/test',
    serveClient: false,
    // below are engine.IO options
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
});

server.listen(PORT);