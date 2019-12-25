const Util = require("../Util"),
  BaseResource = require("./BaseResource"),
  RescAssembler = require("./ResourceAssembler"),
  Api = require("../Api");

/**
 * Talk Resource class used to handle sending a direct message to a specific client connection
 */
class TalkToClient extends BaseResource {

  constructor() {
    super();
    RescAssembler.inject(Api.URI.TalkToClient, (..._) => TalkToClient.resource(..._));
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