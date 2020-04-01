const express = require("express")(),
  server = require('http').Server(express),
  request = require('superagent'),
  helmet = require('helmet'),
  auth = require('http-auth'),
  ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn(),
  StatusMonitor = require("express-status-monitor"),
  bodyParser = require("body-parser"),
  ResourceAssembler = require("./resources/ResourceAssembler"),
  TalkToClient = require("./resources/TalkToClient"),
  TalkToRoom = require("./resources/TalkToRoom"),
  JoinRoom = require("./resources/JoinRoom"),
  LeaveRoom = require("./resources/LeaveRoom"),
  Util = require("./Util"),
  basic = auth.basic({realm: 'Monitor Area'}, function (user, pass, callback) {
    callback(user === 'admin' && pass === 'p@ssw0rd123');
  }),
  io = require('socket.io')(server, {
    serveClient: false,
    allowUpgrades: true,
    pingInterval: 20000,
    pingTimeout: 20000,
    transports: ["polling", "websocket"],
    cookie: false
  });

// TODO we should use better security with passport npm module

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
    this.statusMonitor = StatusMonitor({
      title: "Status | TALK : DreamScale.io",
      path: '',
      websocket: io,
      spans: [{
        interval: 1,
        retention: 60
      }, {
        interval: 1,
        retention: 300
      }, {
        interval: 20,
        retention: 180
      }],
      ignoreStartsWith: '/status'
    });
    express.use(this.statusMonitor.middleware);
    express.use(helmet());
    express.use(bodyParser.json());
    express.use(bodyParser.urlencoded({extended: true}));
    express.get('/status', auth.connect(basic), this.statusMonitor.pageRoute);
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
    ResourceAssembler.inject(JoinRoom);
    ResourceAssembler.inject(LeaveRoom);
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
      let isNewConnection = Util.isNewConnection(connectionId);
      let authUrl = Util.getAuthUrlFromArgs();

      if(authUrl) {
        this.authConnection(authUrl, connectionId, isNewConnection, socket);
      }  else {
        this.connectSocket(connectionId, isNewConnection, socket);
      }
    });
    return this;
  }

  /**
   * authenticates our socket connection with our specific auth server defined at start up
   * @param authUrl
   * @param connectionId
   * @param isNewConnection
   * @param socket
   */
  authConnection(authUrl, connectionId, isNewConnection, socket) {
    Util.log(this, "authenticate : " + connectionId + " -> " + authUrl);

    request
    .post(authUrl + '/account/connect')
    .send({ connectionId: connectionId })
    .timeout({
      response: 20000,
      deadline: 30000
    })
    .set("X-CONNECT-ID", connectionId)
    .set("Content-Type", "application/json")
    .end((err, res) => {
      if(err) {
        this.disconnect(socket, connectionId, err.toString());
      } else if(connectionId !== res.body.connectionId){
        this.disconnect(socket, connectionId, 'Connection Id Mismatch');
      } else {
        this.connectSocket(connectionId, isNewConnection, socket);
      }
    });
  }

  /**
   * connects our socket after we have authenticated it
   * @param connectionId
   * @param isNewConnection
   * @param socket
   */
  connectSocket(connectionId, isNewConnection, socket) {
    Util.log(this, "connection : " + connectionId + " -> " + socket.id + " = " +
      (isNewConnection ? "fresh transport" : "recycled transport"));

    Util.setConnectedSocket(connectionId, socket.id);

    socket.on('error', (error) => {
      Util.log(this, "error : " + socket.id + " -> " + error);
    });
    socket.on("disconnect", (reason) => {
      Util.log(this, "disconnect : " + connectionId + " -> " + socket.id + " = " + reason);
    });
  }

  /**
   * disconnect our socket from the server
   * @param socket
   * @param connectionId
   * @param err
   */
  disconnect(socket, connectionId, err) {
    Util.log(this, "disconnect : " + connectionId + " -> " + socket.id + " = " + err);
    socket.disconnect(true);
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