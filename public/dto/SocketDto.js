//
// model class for ActivationToken
//
module.exports = class ChannelEmitDto {
  constructor(json) {
    try {
      if (typeof json === "string") json = JSON.parse(json);
      this.eventName = json.eventName;
      this.args = json.args;
    }
    catch (e) {
      throw new Error(
        "Unable to create dto 'ChannelEmitDto' : " + e.message
      );
    }
  }
};
