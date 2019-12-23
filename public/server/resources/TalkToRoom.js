const Util = require("../../Util"),
  TalkMessageDto = require("../../dto/TalkMessageDto"),
  BaseResource = require("./BaseResource");

module.exports = class TalkToRoom extends BaseResource {

  constructor() {
    super();
    BaseResource.init(TalkToRoom.SRI, (..._) => TalkToRoom.resource(..._));
  }

  static get SRI() {
    return "/io/to";
  }

  static resource(req, res) {
    try {
      let keys = BaseResource.validateKeys(req, res);
      let dto = new TalkMessageDto(req.body);
      BaseResource.emitToRoom(keys, req, res, dto);
    }
    catch (err) {
      Util.handleErr(err, req, res);
    }
  }
}

