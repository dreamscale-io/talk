module.exports = class TalkMessageDto {
  constructor(request) {
    try {
      if (typeof request === "string") request = JSON.parse(request);
      this.name = request.name;
      this.arg = request.arg;
    }
    catch (e) {
      throw new Error(
        "Unable to create json : " + e.message
      );
    }
  }
};
