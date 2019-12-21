const Util = require("../../Util"),
  SocketDto = require("../../dto/SocketDto"),
  BaseResource = require("./BaseResource");

/**
 * basic server API resource endpoint that is used to emit events onto
 * the wire.
 * @type {SocketEmit}
 */
module.exports = class SocketEmit extends BaseResource {
  constructor() {
    super();
    BaseResource.init(SocketEmit.SRI, (..._) => SocketEmit.resource(..._));
  }

  /**
   * returns the logical service resource
   * @returns {string}
   * @constructor
   */
  static get SRI() {
    return "/socket/emit";
  }

  /**
   * function that represent the call body of this class. This uses static
   * references for better memory usuage to avoid hitting the garbage collector
   * @param req - the request made
   * @param res - the response
   */
  static resource(req, res) {
    try {
      let keys = BaseResource.validateKeys(req, res);
      let dto = new SocketDto(req.body);
      BaseResource.emitToSocket(keys, req, res, dto);
    }
    catch (err) {
      Util.handleErr(err, req, res);
    }
  }
}

