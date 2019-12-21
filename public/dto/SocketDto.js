//
// model class for ActivationToken
//
module.exports = class SocketDto {
  constructor(json) {
    try {
      if (typeof json === "string") json = JSON.parse(json);
      this.name = json.name;
      this.arg = json.arg;
    }
    catch (e) {
      throw new Error(
        "Unable to create 'SocketDto' : " + e.message
      );
    }
  }
};
