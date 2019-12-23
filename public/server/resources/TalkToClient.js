const Util = require("../../Util"),
  TalkMessageDto = require("../../dto/TalkMessageDto"),
  BaseResource = require("./BaseResource");

module.exports = class TalkToClient extends BaseResource {

  constructor() {
    super();
    BaseResource.init(TalkToClient.SRI, (..._) => TalkToClient.resource(..._));
  }

  static get SRI() {
    return "/socket/emit";
  }

  static resource(req, res) {
    try {
      let keys = BaseResource.validateKeys(req, res);
      let dto = new TalkMessageDto(req.body);
      BaseResource.emitToSocket(keys, req, res, dto);
    }
    catch (err) {
      Util.handleErr(err, req, res);
    }
  }
}

