const Util = require("../Util"),
  BaseResource = require("./BaseResource");

module.exports = class TalkToRoom extends BaseResource {

  constructor() {
    super();
    BaseResource.init(TalkToRoom.SRI, (..._) => TalkToRoom.resource(..._));
  }

  static get SRI() {
    return "/talk/to/room/:roomId";
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

