const express = require("express")(),
  server = require('http').Server(express),
  bodyParser = require("body-parser"),
  TalkToClient = require("./resources/TalkToClient"),
  TalkToRoom = require("./resources/TalkToRoom"),
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
 * The core class that defines who and what the Talk server is
 */
class Talk {

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

  setup() {
    Util.log(null, "Starting Server...")
    this.wireResourcesTo();
    this.configureSockets();
    return this;
  }

  wireResourcesTo() {
    Util.log(this, "Wiring resources together")
    this.resources.set(TalkToClient.SRI, new TalkToClient());
    this.resources.set(TalkToRoom.SRI, new TalkToRoom());
    return this;
  }

  configureSockets() {
    Util.log(this, "Configuring io sockets");

    this.io.on("connection", (socket) => {
      let connectionId = Util.getConnectionIdFromSocket(socket);


      // TODO implement Util.reportConnection(connectionId);

      // TODO make this comnditional for when we get a bad report back

      Util.setConnectedSocket(connectionId, socket.id);

      Util.log(this, "Storing connection key -> " + connectionId + " : " + socket.id);

      /// notified across all sockets in network
      socket.on('error', (error) => {
        Util.log(this, "Client error : " + socket.id + " -> " + error);
      });
      socket.on('disconnecting', (reason) => {
        Util.log(this, "Client disconnecting : " + socket.id + " -> " + reason);
      });
      socket.on("disconnect", (reason) => {
        Util.log(this, "Client disconnected : " + socket.id + " -> " + reason);
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
}

module.exports = Talk;