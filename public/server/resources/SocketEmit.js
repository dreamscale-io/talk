const Util = require("../../Util"),
  ChannelEmitDto = require("../../dto/ChannelEmitDto"),
  SimpleStatusDto = require("../../dto/SimpleStatusDto"),
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
    return Util.namespace + "socket/emit";
  }

  /**
   * function that represent the call body of this class. This uses static
   * references for better memory usuage to avoid hitting the garbage collector
   * @param req - the request made
   * @param res - the response
   */
  static resource(req, res) {
    try {
      let key = BaseResource.validate(req, res);

      /// get data and key from the request
      let reqDto = new ChannelEmitDto(req.body);
      let socket = Util.getConnectedSocket(key);

      /// send data to socket and throw errors
      BaseResource.emitToSocket(socket, req, res, reqDto);
    }
    catch (err) {
      BaseResource.handleErr(err, req, res);
    }
  }
}

