const SimpleStatusDto = require("../../dto/SimpleStatusDto"),
  Util = require("../../Util");

module.exports = class BaseResource {

  constructor() {
  }

  static init(sri, clazz) {
    global.talk.express.post(sri, clazz);
  }

  static handleUnknownSocket(socket, req, res, dto) {
    let resDto = new SimpleStatusDto({
      status: "UNKNOWN",
      message: "unable to locate the recipient on network",
    });
    Util.logPostRequest("POST", req.url, dto, resDto);
    res.send(resDto);
    return;
  }

  static sendDirectMessage(req, res, dto) {
    let socket = Util.getConnectedSocket(keys.to);
    if (!socket) {
      BaseResource.handleUnknownSocket(..._);
      return;
    }
    socket.emit(dto.name, dto.arg, (data) => {
      let resDto = new SimpleStatusDto({
        status: "SENT",
        message: "direct message was sent",
      });
      Util.logPostRequest("POST", req.url, dto, resDto);
      res.send(resDto);
    });
  }

  static sendRoomMessage(req, res, dto) {
    global.talk.io.to(keys.to).emit(dto.name, dto.arg);
    let resDto = new SimpleStatusDto({
      status: "SENT",
      message: "message was sent to the room",
    });
    Util.logPostRequest("POST", req.url, dto, resDto);
    res.send(resDto);
  }
}