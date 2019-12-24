const Util = require("../Util"),
  BaseResource = require("./BaseResource");

/**
 * Talk Resource class used to handle sending a direct message to a specific client connection
 */
class TalkToClient extends BaseResource {

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

module.exports = TalkToClient