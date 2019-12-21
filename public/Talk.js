const chalk = require("chalk"),
  express = require("express")(),
  server = require('http').Server(express),
  bodyParser = require("body-parser"),
  socketIO = require("socket.io"),
  SocketEmit = require("./server/resources/SocketEmit"),
  SocketTo = require("./server/resources/SocketTo"),
  IoTo = require("./server/resources/IoTo"),
  Util = require("./Util"),
  io = require('socket.io')(server, {
    serveClient: false,
    allowUpgrades: true,
    pingInterval: 20000,
    pingTimeout: 20000,
    transports: ["polling", "websocket"],
    cookie: false
  });

/**
 * export the Talk class as a module for node
 */
module.exports = (class Talk {

  /**
   * builds the server server and initializes it
   */
  constructor() {
    this.express = express;
    this.server = server;
    this.io = io;
    this.connections = new Map();
    this.resources = new Map();
    this.port = process.env.PORT || 5050;
    express.use(bodyParser.json());
    express.use(bodyParser.urlencoded({extended: true}));
  }

  /**
   * called to create the Talk Server from class Talk
   * @returns {Talk}
   */
  static setup() {
    Util.log(null, "Starting Server...")
    let talk = new Talk();
    global.talk = talk;
    talk.wireReourcesToApi();
    talk.configureSockets();
    return talk;
  }

  /**
   * set ups the API endpoints with corresponding resource classes
   * see -> https://socket.io/docs/emit-cheatsheet/
   * @returns {Talk}
   */
  wireReourcesToApi() {
    Util.log(this, "Wiring resources together")
    this.resources.set(SocketEmit.SRI, new SocketEmit());
    this.resources.set(SocketTo.SRI, new SocketTo());
    this.resources.set(IoTo.SRI, new IoTo());
    return this;
  }

  /**
   * sets up all of the sockets so we can notify their listeners for fluffy and stuffy
   * @returns {Talk}
   */
  configureSockets() {
    Util.log(this, "Configuring io sockets");

    this.io.on("connection", (socket) => {
      Util.logHandshakes(this, socket.handshake);
      Util.log(this, "Storing connection key :: " + socket.handshake.query.key + " -> " + socket.id);

      Util.setConnectedSocket(socket.handshake.query.key, socket.id);

      /// notified across all sockets in network
      socket.on('error', (error) => {
        console.log("Client error : " + socket.id + " -> " + error);
      });
      socket.on('disconnecting', (reason) => {
        console.log("Client disconnecting : " + socket.id + " -> " + reason);
      });
      socket.on("disconnect", (reason) => {
        console.log("Client disconnected : " + socket.id + " -> " + reason);
      });

      /// testing - auto-join a default wtf test room
      socket.join('angry_teachers', (err) => {
        if (err) throw err;
        let rooms = Object.keys(socket.rooms);
        console.log(rooms); // [ <socket.id>, 'room 237' ]
        io.to('angry_teachers').emit('an angry teacher has joined the classroom'); // broadcast to everyone in the room
      });
    });
    return this;
  }

  /**
   * starts the server server within a static instance of this file
   * @returns {Talk}
   */
  begin() {
    server.listen(this.port, () => {
      Util.log(this, `Started on ${this.port}`)
    });
    return this;
  }
})
.setup()
.begin();