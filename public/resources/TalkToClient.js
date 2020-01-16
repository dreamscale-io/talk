const Util = require("../Util"),
  BaseResource = require("./BaseResource");

/**
 * Talk Resource class used to handle sending a direct message to a specific client connection
 */
class TalkToClient extends BaseResource {

  static resource(req, res) {
    try {
      BaseResource.sendDirectMessage(req, res);
    }
    catch (err) {
      Util.handleErr(err, req, res);
    }
  }
}

module.exports = TalkToClient;