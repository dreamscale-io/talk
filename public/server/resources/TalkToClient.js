const Util = require("../../Util"),
  TalkMessageDto = require("../../dto/TalkMessageDto"),
  BaseResource = require("./BaseResource");

module.exports = class TalkToClient extends BaseResource {

  constructor() {
    super();
    BaseResource.init(TalkToClient.SRI, (..._) => TalkToClient.resource(..._));
  }

  static get SRI() {
    return "/talk/to/client/:clientId";
  }

  static resource(req, res) {
    try {
      let dto = new TalkMessageDto(req.body);
      BaseResource.sendDirectMessage(req, res, dto);
    }
    catch (err) {
      Util.handleErr(err, req, res);
    }
  }
}

