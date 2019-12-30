/**
 * defines our basic status reporting object used by gridtime
 */
class SimpleStatusDto {

  /**
   * builds our dto from the request.body, that is json
   * @param json
   */
  constructor(json) {
    try {
      if (typeof json === "string") json = JSON.parse(json);
      this.message = json.message;
      this.status = json.status;
    }
    catch (e) {
      throw new Error("Unable to create dto 'SimpleStatusDto' : " + e.message);
    }
  }

  /**
   * converts the object into a readable string
   */
  toString() {
    JSON.stringify(this);
  }
}

module.exports = SimpleStatusDto;