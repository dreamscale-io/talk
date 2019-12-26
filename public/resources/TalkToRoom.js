const Util = require("../Util"),
  BaseResource = require("./BaseResource");

/**
 * Talk Resource class used for sending (broadcast) a message to an entire room
 */
class TalkToRoom extends BaseResource {

  static resource(req, res) {
    try {
      BaseResource.sendRoomMessage(req, res);
    }
    catch (err) {
      Util.handleErr(err, req, res);
    }
  }
}

module.exports = TalkToRoom;