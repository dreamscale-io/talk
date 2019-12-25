class Api {
  static get URI() {
    return {
      TalkToClient: this.Paths.TALK + this.Paths.TO_CLIENT + this.Paths.PARAM_CLIENT_ID,
      TalkToRoom: this.Paths.TALK + this.Paths.TO_ROOM + this.Paths.PARAM_ROOM_ID
    }
  }

  static get Paths() {
    return {
      TALK: "/talk",
      TO_CLIENT: "/to/client",
      TO_ROOM: "/to/room",
      PARAM_CLIENT_ID: "/:client",
      PARAM_ROOM_ID: "/:roomId",
    }
  }
}

module.exports = Api;