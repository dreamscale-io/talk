const Talk = require("./Talk");

/**
 * A boring un-recycled candy bar wrapper for Talk. Links up talk into our global server space
 */
class Server {

  /**
   * a setup function used to get the server ready for start
   */
  static initialize() {
    global.talk = new Talk();
    global.talk.setup();
  }

  /**
   * starts the server on the given port
   */
  static start() {
    global.talk.begin();
  }
}

module.exports = Server;