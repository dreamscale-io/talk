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
      this.messageId = request.messageId;
      this.originId = request.originId;
      this.destinationId = request.destinationId;
      this.messageTime = request.messageTime;
      this.messageType = request.messageType;
      this.jsonBody = request.jsonBody;
      Util.checkValueOf(this.messageId);
      Util.checkValueOf(this.originId);
      Util.checkValueOf(this.destinationId);
      Util.checkValueOf(this.messageTime);
      Util.checkValueOf(this.messageType);
      Util.checkValueOf(this.jsonBody);
    }
    catch (e) {
      throw new Error("Unable to create json : " + e.message);
    }
  }
}

module.exports = TalkMessageDto;
