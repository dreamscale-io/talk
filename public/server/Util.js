const chalk = require("chalk");

/**
 * Base Utility helper class for Talk, Server, and Friends!
 */
class Util {

  static log(clazz, msg) {
    if (!clazz) clazz = {constructor: {name: "Talk"}};
    console.log(
      chalk.blue("[" + clazz.constructor.name + "]") + " " + msg
    );
  }

  static logSocketIORequest(type, message, socket) {
    console.log(
      chalk.magenta("[talk]") +
      " " +
      type +
      " -> " +
      message +
      " :: " +
      !socket ? "" : socket.id
    );
  }

  static logPostRequest(type, url, dtoReq, dtoRes) {
    console.log(
      chalk.magenta("[TALK]") +
      " " +
      type +
      " -> " +
      url +
      " : REQ=" +
      JSON.stringify(dtoReq) +
      " : RES=" +
      JSON.stringify(dtoRes)
    );
  }

  static logWarnRequest(msg, type, url) {
    console.log(
      chalk.magenta("[API-DEV]") +
      " " +
      chalk.bold.yellow("[WARN]") +
      " " +
      type +
      " -> " +
      url +
      " :: " +
      msg
    );
  }

  static logError(e, type, url) {
    console.log(
      chalk.magenta("[TALK]") +
      " " +
      chalk.bold.red("[ERROR]") +
      " " +
      type +
      " -> " +
      url +
      " : " +
      chalk.bold(e.stack)
    );
  }

  static isObjEmpty(obj) {
    if (Object.keys(obj).length === 0 && obj.constructor === Object) {
      return true;
    }
    return false;
  }

  static checkValueOf(value) {
    if (!value || value === "undefined" || value === "null" || value === "NaN") {
      throw new Error("unable to parse json: invalid fromId");
    }
  }

  static getConnectedSocketFrom(connectionId, req, res) {
    let socket = global.talk.io.sockets.connected[global.talk.connections.get(connectionId)];
    if (!socket) {
      BaseResource.handleUnknownSocket(req, res, req.body);
    }
    return socket;
  }

  static setConnectedSocket(connectionId, socketId) {
    global.talk.connections.set(connectionId, socketId);
  }

  static handleErr(err, req, res) {
    Util.logError(err, "POST", req ? req.url : "");
    res.statusCode = 400;
    res.send(err.message);
  }

  static getConnectionIdFromSocket(socket) {
    return socket.handshake.query.connectionId;
  }
};

module.exports = Util;
