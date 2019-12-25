const express = require("express")(),
  server = require('http').Server(express),
  bodyParser = require("body-parser"),
  ResourceAssembler = require("./resources/ResourceAssembler"),
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

  /**
   * builds the Talk service into a server. stores the components into the service
   */
  constructor() {
    this.express = express;
    this.server = server;
    this.io = io;
    this.connections = new Map();
    this.port = process.env.PORT || 5050;
    express.use(bodyParser.json());
    express.use(bodyParser.urlencoded({extended: true}));
  }

  /**
   * called by the server class to build the service for use
   * @returns {Talk} - the thing we built
   */
  setup() {
    Util.log(null, "Starting Server...")
    this.wireApiToResources();
    this.configureSockets();
    return this;
  }

  /**
   * this function uses our resource assembler to generate the classes and
   * service URLs used for express to handle our POST requests
   * @returns {Talk}
   */
  wireApiToResources() {
    Util.log(this, "Wiring resources together")
    ResourceAssembler.inject(TalkToClient);
    ResourceAssembler.inject(TalkToRoom);
    return this;
  }

  /**
   * this function is used to configure out socket listeners for socket.io, and
   * these are global listeners. try not to add stuff into here is possible
   * @returns {Talk} - the talk service object for chaining
   */
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

  /**
   * starts the server on the port specified by the cli argument
   * @returns {Talk}
   */
  begin() {
    server.listen(this.port, () => {
      Util.log(this, `Started on ${this.port}`)
    });
    return this;
  }
}

module.exports = Talk;