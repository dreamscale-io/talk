const Util = require("../Util");

/**
 * Object that is recieved by the REST interface for talk room members
 */
class ClientConnectionDto {

  constructor(request) {
    try {
      if (typeof request === "string") request = JSON.parse(request);
      this.connectionId = request.connectionId;
      Util.checkValueOf(this.connectionId);
    }
    catch (e) {
      throw new Error("Unable to create json : " + e.message);
    }
  }
}

module.exports = ClientConnectionDto;
