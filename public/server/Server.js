const Talk = require("./Talk");

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