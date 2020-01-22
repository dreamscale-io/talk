const Util = require("../Util"),
  BaseResource = require("./BaseResource");

/**
 * Talk Resource class used to have a socket leave a room
 */
class LeaveRoom extends BaseResource {

  static resource(req, res) {
    try {
      BaseResource.leaveRoom(req, res);
    }
    catch (err) {
      Util.handleErr(err, req, res);
    }
  }
}

module.exports = LeaveRoom;