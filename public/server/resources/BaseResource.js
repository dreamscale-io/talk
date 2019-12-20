const SimpleStatusDto = require("../../dto/SimpleStatusDto"),
  Util = require("../../Util");

module.exports = class BaseResource {
  constructor() {
  }

  static init(sri, clazz) {
    global.talk.express.post(sri, clazz);
  }

  /**
   * validates the header information of the request with the request and response
   * @param request
   * @param response
   */
  static validate(request, response) {
    let key = request.headers["x-talk-key"];

    if (!key) {
      let dto = new SimpleStatusDto({
        status: "INVALID",
        message: "unable to perform request with given header information.",
      });
      response.send(dto);
      Util.logWarnRequest(JSON.stringify(dto), "POST", request.url);
      return null;
    }
    return key;
  }
}