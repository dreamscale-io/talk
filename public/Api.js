/**
 * the class in charge of wiring together our REST endpoint urls into our Resources using
 * object reflection
 *
 * NOTE: do not forget to add the injector call to the Talk.wireApiToResources();
 */
class Api {

  /**
   * Enum get helper function which is used to store the REST URLs
   * @returns {{TalkToClient: string, TalkToRoom: string}}
   * @constructor
   */
  static get URI() {
    return {
      TalkToClient: this.Paths.TALK + this.Paths.TO_CLIENT + this.Paths.PARAM_CLIENT_ID,
      TalkToRoom: this.Paths.TALK + this.Paths.TO_ROOM + this.Paths.PARAM_ROOM_ID,
      JoinRoom: this.Paths.TALK + this.Paths.JOIN_ROOM + this.Paths.PARAM_ROOM_ID,
      LeaveRoom: this.Paths.TALK + this.Paths.LEAVE_ROOM + this.Paths.PARAM_ROOM_ID
    }
  }

  /**
   * Enum used to store the path string variables which make up the URI's
   * @returns {{TO_ROOM: string, PARAM_CLIENT_ID: string, TO_CLIENT: string, PARAM_ROOM_ID: string, TALK: string}}
   * @constructor
   */
  static get Paths() {
    return {
      TALK: "/talk",
      TO_CLIENT: "/to/client",
      TO_ROOM: "/to/room",
      JOIN_ROOM: "/join/room",
      LEAVE_ROOM: "/leave/room",
      PARAM_CLIENT_ID: "/:client",
      PARAM_ROOM_ID: "/:roomId"
    }
  }
}

module.exports = Api;