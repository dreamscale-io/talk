const chalk = require("chalk"),
  SimpleStatusDto = require("./dto/SimpleStatusDto");

/**
 * Base Utility helper class for Talk, Server, and Friends!
 */
class Util {

  /**
   * performs general logging function, logs the class name and message
   * @param clazz
   * @param msg
   */
  static log(clazz, msg) {
    if (!clazz) clazz = {constructor: {name: "Talk"}};
    console.log(
      chalk.blue("[" + clazz.constructor.name + "]") + " " + msg
    );
  }

  /**
   * function used to log our incoming POST request
   * @param type
   * @param url
   * @param dto
   */
  static logRequest(type, url, dto, status) {
    console.log(
      chalk.magenta("[TALK]") +
      " " +
      type +
      " -> " +
      url +
      " : REQ=" +
      JSON.stringify(dto) +
      " : STATUS=" +
      JSON.stringify(status)
    );
  }

  /**
   * function used to log any of our warnings. maybe go into its own ServerError class?
   * @param msg
   * @param type
   * @param url
   */
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

  /**
   * a function used to log our server errors
   * @param e
   * @param type
   * @param url
   */
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

  /**
   * function for figuring out if an object is empty
   * @param obj
   * @returns {boolean}
   */
  static isObjEmpty(obj) {
    if (Object.keys(obj).length === 0 && obj.constructor === Object) {
      return true;
    }
    return false;
  }

  /**
   * a general purpose lookup function used to get a connected socket from connection id
   * @param connectionId
   */
  static getConnectedSocketFrom(connectionId) {
    let socket = global.talk.io.sockets.connected[global.talk.connections.get(connectionId)];
    return socket;
  }

  /**
   * stores a newly connected socket on global hash map
   * @param connectionId
   * @param socketId
   */
  static setConnectedSocket(connectionId, socketId) {
    global.talk.connections.set(connectionId, socketId);
  }

  /**
   * handles any request errors from our resources
   * @param err
   * @param req
   * @param res
   */
  static handleErr(err, req, res) {
    Util.logError(err, "POST", req ? req.url : "");
    res.statusCode = 400;
    res.send(err.message);
  }

  /**
   * a function used to look up a connection id from a given socket
   * @param socket
   */
  static getConnectionIdFromSocket(socket) {
    return socket.handshake.query.connectionId;
  }

  /**
   * general purpose function used to check our connection is new
   * @param connectionId
   * @returns {boolean}
   */
  static isNewConnection(connectionId) {
    return !global.talk.connections.has(connectionId);
  }
};

module.exports = Util;
