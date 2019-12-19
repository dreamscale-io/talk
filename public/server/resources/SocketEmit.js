const Util = require("../../../Util");
const ChannelEmitDto = require("../../../dto/ChannelEmitDto");
const SimpleStatusDto = require("../../../dto/SimpleStatusDto");
const BaseEmit = require("./BaseResource");
const GLOBAL_ = global;

/**
 * basic server API resource endpoint that is used to emit events onto
 * the wire.
 * @type {SocketEmit}
 */
module.exports = class SocketEmit extends BaseEmit{
  constructor(server) {
    super();
    return (req, res) => {
      try {
        console.log(GLOBAL_.talk);
        console.log(this.validateHeaders());
        let socketId = req.headers['x-talk-key' +
        ''];

        /// check to see if we are passing the correct header information
        if (!socketId) {
          let dtoRes = new SimpleStatusDto({
            status: "INVALID",
            message: "unable to perform request with given header information.",
          });
          res.send(dtoRes);
          Util.logWarnRequest(JSON.stringify(dtoRes), "POST", req.url);
          return;
        }

        // extract the POST data into DTO request objecr
        let dtoReq = new ChannelEmitDto(req.body);
        let socket = server.io.sockets.connected[server.connections.get(socketId)];
        Util.logSocketIORequest(dtoReq.eventName, dtoReq.args, socket);

        /// check if we have any sockets connected
        if (socket) {
          socket.emit(dtoReq.eventName, dtoReq.args, (data) => {
            let dtoRes = new SimpleStatusDto({
              status: "SENT",
              message: "message sent to feed",
            });
            Util.logPostRequest("POST", req.url, dtoReq, dtoRes);
            res.send(dtoRes);
          });
        }

        /// if we do not have any sockets, no one is connected
        else {
          let dtoRes = new SimpleStatusDto({
            status: "UNKNOWN",
            message: "unable to locate the recipient on network",
          });
          Util.logPostRequest("POST", req.url, dtoReq, dtoRes);
          res.send(dtoRes);
        }
      }

        /// catch any unchecked errors so we can return from this request
      catch (e) {
        Util.logError(e, "POST", req.url);
        res.statusCode = 400;
        res.send(e.message);
      }
    }
  }
};
