const SimpleStatusDto = require("../../dto/SimpleStatusDto"),
  Util = require("../../Util");

module.exports = class BaseResource {

  constructor() {
  }

  static init(sri, clazz) {
    global.talk.express.post(sri, clazz);
  }

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

  static handleUnknownSocket(socket, req, res, reqDto) {
    let resDto = new SimpleStatusDto({
      status: "UNKNOWN",
      message: "unable to locate the recipient on network",
    });
    Util.logPostRequest("POST", req.url, reqDto, resDto);
    res.send(resDto);
    return;
  }

  static handleUnknownKeys(keys, req, res, reqDto) {
    let resDto = new SimpleStatusDto({
      status: "UNKNOWN",
      message: "unknown or invalid header key pair",
    });
    Util.logPostRequest("POST", req.url, reqDto, resDto);
    res.send(resDto);
    return;
  }

  static checkKeys(keys, req, res, reqDto) {
    if (!keys) {
      BaseResource.handleUnknownKeys(keys, req, res, reqDto);
      return;
    }
  }

  static emitToSocket(keys, req, res, reqDto) {
    this.checkKeys(keys, req, res, reqDto);
    let socket = Util.getConnectedSocket(keys.to);
    if (!socket) {
      BaseResource.handleUnknownSocket(..._);
      return;
    }
    socket.emit(reqDto.name, reqDto.arg, (data) => {
      let resDto = new SimpleStatusDto({
        status: "SENT",
        message: "event emitted to socket",
      });
      Util.logPostRequest("POST", req.url, reqDto, resDto);
      res.send(resDto);
    });
  }

  static emitToRoom(keys, req, res, reqDto) {
    this.checkKeys(keys, req, res, reqDto);
    global.talk.io.to(keys.to).emit(reqDto.name, reqDto.arg);
    let resDto = new SimpleStatusDto({
      status: "SENT",
      message: "event emitted to room",
    });
    Util.logPostRequest("POST", req.url, reqDto, resDto);
    res.send(resDto);
  }

  static emitToRoomFromSocket(keys, req, res, reqDto) {
    this.checkKeys(keys, req, res, reqDto);
    let socket = Util.getConnectedSocket(keys.from);
    if (!socket) {
      BaseResource.handleUnknownSocket(..._);
      return;
    }
    socket.to(keys.to).emit(reqDto.name, reqDto.arg);
    let resDto = new SimpleStatusDto({
      status: "SENT",
      message: "event emitted to room",
    });
    Util.logPostRequest("POST", req.url, reqDto, resDto);
    res.send(resDto);
  }
}