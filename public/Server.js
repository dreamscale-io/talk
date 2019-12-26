const Talk = require("./Talk");

/**
 * A boring un-recycled candy bar wrapper for Talk. Links up talk into our global server space
 */
class Server {

  constructor() {
    global.talk = new Talk();
    global.talk.setup();
  }

  start() {
    global.talk.begin();
  }
}

module.exports = Server;