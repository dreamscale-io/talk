const Util = require("../Util");

/**
 * Object that is recieved by the REST interface for talk
 */
class TalkMessageDto {

  /**
   * builds our most used dto from the json in the request body
   * @param request
   */
  constructor(request) {
    try {
      if (typeof request === "string") request = JSON.parse(request);
      this.fromId = request.fromId;
      this.toId = request.toId;
      this.nanoTime = request.nanoTime;
      this.messageType = request.messageType;
      this.jsonBody = request.jsonBody;
      Util.checkValueOf(this.fromId);
      Util.checkValueOf(this.toId);
      Util.checkValueOf(this.nanoTime);
      Util.checkValueOf(this.messageType);
      Util.checkValueOf(this.jsonBody);
    }
    catch (e) {
      throw new Error("Unable to create json : " + e.message);
    }
  }
}

module.exports = TalkMessageDto;
