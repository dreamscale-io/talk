const Util = require("../../Util"),
  TalkMessageDto = require("../../dto/TalkMessageDto"),
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
      let dto = new TalkMessageDto(req.body);
      BaseResource.sendRoomMessage(req, res, dto);
    }
    catch (err) {
      Util.handleErr(err, req, res);
    }
  }
}

