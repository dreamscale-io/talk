const chalk = require("chalk");

module.exports = class Util {

  /**
   * generalized logging for the express server
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
   * handles logging of connections coming requesting permisison
   * @param handshake
   */
  static logHandshakes(handshake) {

    // TODO need to implement a prettier way to log this stuff

    // console.log(handshake);
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

  /**
   * checks weather the object is empty or not
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
   * gets the connected socket by Id from the global static list
   * @param talkKey
   * @returns {*}
   */
  static getConnectedSocket(talkKey) {
    return global.talk.io.sockets.connected[global.talk.connections.get(talkKey)]
  }

  /**
   * saves the socket into identification map
   * @param talkKey
   * @param socketId
   */
  static setConnectedSocket(talkKey, socketId) {
    global.talk.connections.set(talkKey, socketId);
  }

  /**
   * handles any errors that the resource might throw
   * @param err
   * @param req
   * @param res
   */
  static handleErr(err, req, res) {
    Util.logError(err, "POST", req ? req.url : "");
    res.statusCode = 400;
    res.send(err.message);
  }
};
