const ClientConnectionDto = require("../dto/ClientConnectionDto"),
  SimpleStatusDto = require("../dto/SimpleStatusDto"),
  TalkMessageDto = require("../dto/TalkMessageDto"),
  Util = require("../Util");

/**
 * the lowest of the low, grittiest of gritty, herrrreees BaseResource. This class can send
 * receive, slice and dice its way into any and all little http post request that come into
 * node. PS. implemented by all other resources
 */
class BaseResource {

  static get EventTypes() {
    return {
      MESSAGE_ROOM: "message_room",
      MESSAGE_CLIENT: "message_client",
      JOIN_ROOM: "join_room",
      LEAVE_ROOM: "leave_room"
    }
  }

  static get MessageStatusTypes() {
    return {
      ERROR: "ERROR",
      SENT: "SENT",
      JOINED: "JOINED",
      LEAVE: "LEAVE",
      UNKNOWN: "UNKNOWN",
      RECEIVED: "RECEIVED"
    }
  }

  static get MessageStrings() {
    return {
      SENT_MESSAGE: "The direct message was sent to client.",
      SENT_ROOM_MESSAGE: "The message was sent to the room.",
      UNKNOWN_CLIENT: "Talk was unable to locate the recipient on network.",
      JOIN_ROOM: "The client joined the room.",
      LEAVE_ROOM: "The client left the room.",
      ERROR_MESSAGE: "we encountered an error with the room : "
    }
  }

  static sendDirectMessage(request, response) {
    let dto = new TalkMessageDto(request.body),
      socket = Util.getConnectedSocketFrom(dto.uri),
      status = BaseResource.getDirectMessageStatus();

    if (!socket) {
      status = BaseResource.getUnknownSocketStatus();
      BaseResource.logAndSendResponse(dto, status, request, response);
    }
    else {
      socket.emit(BaseResource.EventTypes.MESSAGE_CLIENT, dto, (err) => {
        if (err) {
          status = BaseResource.getDirectMessageErrorStatus(err);
        }
        BaseResource.logAndSendResponse(dto, status, request, response)
      });
    }
  }

  static sendRoomMessage(request, response) {
    let dto = new TalkMessageDto(request.body),
      status = BaseResource.getRoomMessageStatus();

    global.talk.io.to(dto.uri).emit(BaseResource.EventTypes.MESSAGE_ROOM, dto);
    BaseResource.logAndSendResponse(dto, status, request, response)
  }

  static joinRoom(request, response) {
    let dto = new ClientConnectionDto(request.body),
      roomId = BaseResource.getRoomIdFromRequest(request),
      status = BaseResource.getJoinRoomStatus(),
      socket = Util.getConnectedSocketFrom(dto.connectionId);

    if (!socket) {
      status = BaseResource.getUnknownSocketStatus();
      BaseResource.logAndSendResponse(dto, status, request, response)
    }
    else {
      socket.emit(BaseResource.EventTypes.JOIN_ROOM, roomId, (roomId) => {
        socket.join(roomId, (err) => {
          if (err) {
            status = BaseResource.getJoinRoomStatus(err);
          }
          BaseResource.logAndSendResponse(dto, status, request, response)
        });
      });
    }
  }

  static leaveRoom(request, response) {
    let dto = new ClientConnectionDto(request.body),
      roomId = BaseResource.getRoomIdFromRequest(request),
      status = BaseResource.getLeaveRoomStatus(),
      socket = Util.getConnectedSocketFrom(dto.connectionId);

    if (!socket) {
      status = BaseResource.getUnknownSocketStatus();
      BaseResource.logAndSendResponse(dto, status, request, response);
    }
    else {
      socket.emit(BaseResource.EventTypes.LEAVE_ROOM, roomId, (roomId) => {
        socket.leave(roomId, (err) => {
          if (err) {
            status = BaseResource.getLeaveRoomErrorStatus(err);
          }
          BaseResource.logAndSendResponse(dto, status, request, response);
        });
      });
    }
  }

  static logAndSendResponse(dto, status, request, response) {
    Util.logRequest("POST", request.url, dto, status);
    response.send(status);
  }

  static getRoomIdFromRequest(req) {
    let roomId = req.params.roomId;
    return roomId;
  }

  static getUnknownSocketStatus() {
    return new SimpleStatusDto({
      status: BaseResource.MessageStatusTypes.UNKNOWN,
      message: BaseResource.MessageStrings.UNKNOWN_CLIENT,
    });
  }

  static getDirectMessageStatus(err) {
    return new SimpleStatusDto({
      status: this.MessageStatusTypes.SENT,
      message: this.MessageStrings.SENT_MESSAGE
    })
  }

  static getDirectMessageErrorStatus(err) {
    return new SimpleStatusDto({
      status: this.MessageStatusTypes.ERROR,
      message: err.message
    });
  }

  static getRoomMessageStatus() {
    return new SimpleStatusDto({
      status: this.MessageStatusTypes.SENT,
      message: this.MessageStrings.SENT_ROOM_MESSAGE
    });
  }

  static getJoinRoomStatus() {
    return new SimpleStatusDto({
      status: BaseResource.MessageStatusTypes.JOINED,
      message: BaseResource.MessageStrings.JOIN_ROOM
    });
  }

  static getJoinRoomErrorStatus(err) {
    return new SimpleStatusDto({
      status: BaseResource.MessageStatusTypes.ERROR,
      message: BaseResource.MessageStrings.ERROR_MESSAGE + err.message
    });
  }

  static getLeaveRoomStatus() {
    return new SimpleStatusDto({
      status: BaseResource.MessageStatusTypes.LEAVE,
      message: BaseResource.MessageStrings.LEAVE_ROOM
    });
  }

  static getLeaveRoomErrorStatus(err) {
    return new SimpleStatusDto({
      status: BaseResource.MessageStatusTypes.ERROR,
      message: BaseResource.MessageStrings.ERROR_MESSAGE + err.message
    });
  }
}

module.exports = BaseResource;