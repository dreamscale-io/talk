const chalk = require("chalk"),
  express = require("express")(),
  server = require('http').Server(express),
  bodyParser = require("body-parser"),
  socketIO = require("socket.io"),
  TalkToClient = require("./server/resources/TalkToClient"),
  TalkToRoom = require("./server/resources/TalkToRoom"),
  Util = require("./Util"),
  io = require('socket.io')(server, {
    serveClient: false,
    allowUpgrades: true,
    pingInterval: 20000,
    pingTimeout: 20000,
    transports: ["polling", "websocket"],
    cookie: false
  });

module.exports = (class Talk {

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

  static setup() {
    Util.log(null, "Starting Server...")
    let talk = new Talk();
    global.talk = talk;
    talk.wireReourcesToApi();
    talk.configureSockets();
    return talk;
  }

  wireReourcesToApi() {
    Util.log(this, "Wiring resources together")
    this.resources.set(TalkToClient.SRI, new TalkToClient());
    this.resources.set(TalkToRoom.SRI, new TalkToRoom());
    return this;
  }

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

  begin() {
    server.listen(this.port, () => {
      Util.log(this, `Started on ${this.port}`)
    });
    return this;
  }
})
.setup()
.begin();