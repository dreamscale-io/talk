const SimpleStatusDto = require("../../dto/SimpleStatusDto"),
  Util = require("../../Util");

/**
 * base class that all resources implement
 * @type {BaseResource}
 */
module.exports = class BaseResource {

  /**
   * builds the base object for the resource
   */
  constructor() {
  }

  /**
   * initializes the BaseResource class for this resource
   * @param sri
   * @param clazz
   */
  static init(sri, clazz) {
    global.talk.express.post(sri, clazz);
  }

  /**
   * validates the header information of the request with the request and response
   * @param request
   * @param response
   */
  static validateKeys(request, response) {
    let keyTo = request.headers["x-talk-key-to"],
      keyFrom = request.headers["x-talk-key-from"];

    if (!keyTo || !keyFrom) {
      let dto = new SimpleStatusDto({
        status: "INVALID",
        message: "unable to perform request with given header information.",
      });
      response.send(dto);
      Util.logWarnRequest(JSON.stringify(dto), "POST", request.url);
      return null;
    }
    return {to: keyTo, from: keyFrom};
  }

  /**
   * handles any errors that the resource might throw
   * @param err
   * @param req
   * @param res
   */
  static handleErr(err, req, res) {
    Util.logError(err, "POST", req ? req.url : "");
    res.statusCode = 400;
    res.send(err.message);
  }

  /**
   * called when we try to emit and event to a socket that doesn't exist on
   * the server
   * @param socket
   * @param req
   * @param res
   * @param reqDto
   */
  static handleUnknownSocket(socket, req, res, reqDto) {
    let resDto = new SimpleStatusDto({
      status: "UNKNOWN",
      message: "unable to locate the recipient on network",
    });
    Util.logPostRequest("POST", req.url, reqDto, resDto);
    res.send(resDto);
    return;
  }

  /**
   * called when we do not have proper pair of keys
   * @param keys
   * @param req
   * @param res
   * @param reqDto
   */
  static handleUnknownKeys(keys, req, res, reqDto) {
    let resDto = new SimpleStatusDto({
      status: "UNKNOWN",
      message: "unknown or invalid header key pair",
    });
    Util.logPostRequest("POST", req.url, reqDto, resDto);
    res.send(resDto);
    return;
  }

  /**
   * emit an event to a specific socket
   * @param keys - the skey pair of to/from id
   * @param req - the request that was made
   * @param res - the response sent to the calling function
   * @param reqDto - the request data that was posted
   */
  static emitToSocket(keys, req, res, reqDto) {
    if (!keys) {
      BaseResource.handleUnknownKeys(..._);
      return;
    }
    let socket = Util.getConnectedSocket(keys.to);
    if (!socket) {
      BaseResource.handleUnknownSocket(..._);
      return;
    }
    socket.emit(reqDto.eventName, reqDto.args, (data) => {
      let resDto = new SimpleStatusDto({
        status: "SENT",
        message: "event emitted to socket",
      });
      Util.logPostRequest("POST", req.url, reqDto, resDto);
      res.send(resDto);
    });
  }

  static emitToRoom(keys, req, res, reqDto) {
    if (!keys) {
      BaseResource.handleUnknownKeys(..._);
      return;
    }
    global.talk.io.to(keys.to).emit(reqDto.eventName, reqDto.args);
    let resDto = new SimpleStatusDto({
      status: "SENT",
      message: "event emitted to room",
    });
    Util.logPostRequest("POST", req.url, reqDto, resDto);
    res.send(resDto);
  }
}