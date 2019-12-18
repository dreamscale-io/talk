const chalk = require("chalk"),
  express = require("express"),
  bodyParser = require("body-parser"),
  socketIO = require("socket.io"),
  ChannelEmit = require("./resource/ChannelEmit");

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server, {
  serveClient: false,
  // below are engine.IO options
  allowUpgrades: true,
  pingInterval: 10000,
  pingTimeout: 5000,
  transports: ["polling", "websocket"],
  cookie: false
});

const Server = (module.exports = class Server {
  constructor() {

    /// initialize
    this.port = process.env.PORT || 5050;
    console.log(
      chalk.blue("Starting Talk Server...")
    );

    /// setup
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    /// restful
    app.post("/channel/:channelId/emit", new ChannelEmit(io));

    // TODO make request to htm-flow to authenticate the handshake query

    /// socket.io
    io.on("connection", (socket) => {
      console.log("Client connected " + socket.id);
      console.log(socket.handshake);

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


    /// start the server
    server.listen(this.port, () => {
      console.log(`Listening on ${this.port}`);
    });
  }
});

function start() {
  let server = new Server();
}

start();
