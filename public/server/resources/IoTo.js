const Util = require("../../Util"),
  SocketDto = require("../../dto/SocketDto"),
  BaseResource = require("./BaseResource");

/**
 * basic server API resource endpoint that is used to emit events to rooms
 * the wire.
 * @type {IoTo}
 */
module.exports = class IoTo extends BaseResource {
  constructor() {
    super();
    BaseResource.init(IoTo.SRI, (..._) => IoTo.resource(..._));
  }

  /**
   * returns the logical service resource
   * @returns {string}
   * @constructor
   */
  static get SRI() {
    return "/io/to";
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
      let socketDto = new SocketDto(req.body);
      BaseResource.emitToRoom(keys, req, res, socketDto);
    }
    catch (err) {
      BaseResource.handleErr(err, req, res);
    }
  }
}

