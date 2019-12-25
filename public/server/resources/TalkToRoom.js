const Util = require("../Util"),
  BaseResource = require("./BaseResource"),
  ResourceAssembler = require("./ResourceAssembler"),
  Api = require("../Api");

/**
 * Talk Resource class used for sending (broadcast) a message to an entire room
 */
class TalkToRoom extends BaseResource {

  constructor() {
    super();
    ResourceAssembler.inject(TalkToRoom);
  }

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