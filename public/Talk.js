const chalk = require("chalk"),
  express = require("express")(),
  server = require('http').Server(express),
  bodyParser = require("body-parser"),
  socketIO = require("socket.io"),
  SocketEmit = require("./server/resources/SocketEmit"),
  Util = require("./Util"),
  io = require('socket.io')(server, {
    serveClient: false,
    allowUpgrades: true,
    pingInterval: 10000,
    pingTimeout: 5000,
    transports: ["polling", "websocket"],
    cookie: false
  });

/**
 * export the Talk class as a module for node
 */
module.exports = (

  /**
   * the root class of he server service which rides on top of the node express server
   */
  class Talk {

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
      return this;
    }

    /**
     * sets up all of the sockets so we can notify their listeners for fluffy and stuffy
     * @returns {Talk}
     */
    configureSockets() {
      Util.log(this, "Configuring io sockets");

      this.io.on("connection", (socket) =>
      {
        Util.logHandshakes(this, socket.handshake);
        Util.log(this, "Storing connection key :: " + socket.handshake.query.key + " -> " + socket.id);

        // reference connection id to socket id.
        Util.setConnectedSocket(socket.handshake.query.key, socket.id);

        // GLOBAL - all channels are notified here
        socket.on('error', (error) => {
          console.log("Client error : " + socket.id + " -> " + error);
        });
        socket.on('disconnecting', (reason) => {
          // still in rooms
          console.log("Client disconnecting : " + socket.id + " -> " + reason);
        });
        socket.on("disconnect", (reason) => {
          console.log("Client disconnected : " + socket.id + " -> " + reason);
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