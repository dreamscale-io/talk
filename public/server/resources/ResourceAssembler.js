
class ResourceAssembler {

  constructor() {
  }

  static inject(sri, clazz) {
    global.talk.express.post(sri, (..._) => clazz.resource(..._));
  }
}

module.exports = ResourceAssembler;