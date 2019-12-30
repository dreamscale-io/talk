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
      this.id = request.id;
      this.uri = request.uri;
      this.messageTime = request.messageTime;
      this.messageType = request.messageType;
      this.metaProps = request.metaProps;
      this.jsonBody = request.jsonBody;
    }
    catch (e) {
      throw new Error("Unable to create json : " + e.message);
    }
  }
}

module.exports = TalkMessageDto;
