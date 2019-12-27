const SimpleStatusDto = require("../dto/SimpleStatusDto"),
  ClientConnectionDto = require("../dto/ClientConnectionDto"),
  TalkMessageDto = require("../dto/TalkMessageDto"),
  Util = require("../Util");

/**
 * the lowest of the low, grittiest of gritty, herrrreees BaseResource. This class can send
 * recieve, slice and dice its way into any and all little http post request that come into
 * node. PS. implemented by all other resources
 */
class BaseResource {

  static handleUnknownRoom(req, res, dto) {
    let resDto = new SimpleStatusDto({
      status: "UNKNOWN",
      message: "unable to locate the room on network",
    });
    Util.logPostRequest("POST", req.url, dto, resDto);
    res.send(resDto);
    return;
  }

  static handleRoomError(err, req, res, dto) {
    let resDto = new SimpleStatusDto({
      status: "ERROR",
      message: "we encounter an error with the room : " + err.message
    });
    Util.logPostRequest("POST", req.url, dto, resDto);
    res.send(resDto);
    return;
  }

  static sendDirectMessage(req, res) {
    let dto = new TalkMessageDto(req.body);
    let socket = Util.getConnectedSocketFrom(dto.toId, req, res);
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

  static joinRoom(req, res) {
    let roomId = BaseResource.getRoomIdFromRequestUrlParam(req);
    let dto = new ClientConnectionDto(req.body);
    let socket = Util.getConnectedSocketFrom(dto.connectionId, req, res);
    socket.emit("join_room", roomId, (roomId) => {
      socket.join(roomId, (err) => {
        if (err) {
          BaseResource.handleRoomError(err, req, res);
          return;
        }
        let resDto = new SimpleStatusDto({
          status: "JOINED",
          message: "joined room '" + roomId + "'",
        });
        Util.logPostRequest("POST", req.url, dto, resDto);
        res.send(resDto);
      });
    });
  }

  static leaveRoom(req, res) {
    let roomId = BaseResource.getRoomIdFromRequestUrlParam(req);
    let dto = new ClientConnectionDto(req.body);
    let socket = Util.getConnectedSocketFrom(dto.connectionId, req, res);
    socket.emit("leave_room", roomId, (roomId) => {
      socket.leave(roomId, (err) => {
        if (err) {
          BaseResource.handleRoomError(err, req, res);
          return;
        }
        let resDto = new SimpleStatusDto({
          status: "LEAVE",
          message: "left room '" + roomId + "'",
        });
        Util.logPostRequest("POST", req.url, dto, resDto);
        res.send(resDto);
      });
    });
  }

  static getRoomIdFromRequestUrlParam(req, res) {
    let roomId = req.params.roomId;
    if (!roomId) {
      BaseResource.handleUnknownRoom(req, res, req.body);
      return;
    }
    return roomId;
  }

  static get EventTypes() {
    return {
      MESSAGE_ROOM: "message_room",
      MESSAGE_CLIENT: "message_client"
    }
  }
}

module.exports = BaseResource;