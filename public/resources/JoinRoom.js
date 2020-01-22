const Util = require("../Util"),
  BaseResource = require("./BaseResource");

/**
 * Talk Resource class used to handle having a socket join a room
 */
class JoinRoom extends BaseResource {

  static resource(req, res) {
    try {
      BaseResource.joinRoom(req, res);
    }
    catch (err) {
      Util.handleErr(err, req, res);
    }
  }
}

module.exports = JoinRoom;