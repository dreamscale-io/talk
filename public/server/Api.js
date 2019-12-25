class Api {
  static get URI() {
    return {
      TalkToClient: "/talk/to/client/:clientId",
      TalkToRoom: "/talk/to/room/:roomId"
    }
  }
}

module.exports = Api;