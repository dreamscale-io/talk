const Talk = require("./Talk");

/**
 * A boring un-recycled candy bar wrapper for Talk. Links up talk into our global server space
 */
class Server {

  static initialize() {
    global.talk = new Talk();
    global.talk.setup();
  }

  static start() {
    global.talk.begin();
  }
}

module.exports = Server;