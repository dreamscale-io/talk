const Util = require("../Util"),
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
      BaseResource.sendDirectMessage(req, res);
    }
    catch (err) {
      Util.handleErr(err, req, res);
    }
  }
}

