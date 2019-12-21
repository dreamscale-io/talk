const Util = require("../../Util"),
  SocketDto = require("../../dto/SocketDto"),
  BaseResource = require("./BaseResource");

/**
 * basic server API resource endpoint that is used to emit events onto rooms
 * the wire.
 * @type {SocketTo}
 */
module.exports = class SocketTo extends BaseResource {
  constructor() {
    super();
    BaseResource.init(SocketTo.SRI, (..._) => SocketTo.resource(..._));
  }

  /**
   * returns the service resource
   * @returns {string}
   * @constructor
   */
  static get SRI() {
    return "/socket/to";
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
      BaseResource.emitToRoomFromSocket(keys, req, res, dto);
    }
    catch (err) {
      Util.handleErr(err, req, res);
    }
  }
}

