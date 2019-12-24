const SimpleStatusDto = require("../dto/SimpleStatusDto"),
  TalkMessageDto = require("../dto/TalkMessageDto"),
  Util = require("../Util");

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

  static sendDirectMessage(req, res) {
    let dto = new TalkMessageDto(req.body);
    let socket = Util.getConnectedSocketFrom(dto.toId);
    if (!socket) {
      BaseResource.handleUnknownSocket(req, res);
      return;
    }
    socket.emit(BaseResource.EventTypes.MESSAGE_CLIENT, dto.jsonBody, (data) => {
      let resDto = new SimpleStatusDto({
        status: "SENT",
        message: "direct message was sent",
      });
      Util.logPostRequest("POST", req.url, dto, resDto);
      res.send(resDto);
    });
  }

  static sendRoomMessage(req, res) {
    let dto = new TalkMessageDto(req.body);
    global.talk.io.to(dto.toId).emit(BaseResource.EventTypes.MESSAGE_ROOM, dto.jsonBody);
    let resDto = new SimpleStatusDto({
      status: "SENT",
      message: "message was sent to the room",
    });
    Util.logPostRequest("POST", req.url, dto, resDto);
    res.send(resDto);
  }

  static get EventTypes() {
    return {
      MESSAGE_ROOM: "message-room",
      MESSAGE_CLIENT: "message-client"
    }
  }
}