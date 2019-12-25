const Api = require("../Api");

class ResourceAssembler {

  constructor() {
  }

  static inject(clazz) {
    if(!clazz.hasOwnProperty('resource')) {
      throw new Error("All resources of type 'BaseResource' require the static function 'resource'");
    }
    global.talk.express.post(Api.URI[clazz.name], (..._) => clazz.resource(..._));
  }
}

module.exports = ResourceAssembler;