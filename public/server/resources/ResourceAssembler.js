
class ResourceAssembler {

  constructor() {
  }

  static inject(sri, clazz) {
    global.talk.express.post(sri, clazz);
  }
}

module.exports = ResourceAssembler;