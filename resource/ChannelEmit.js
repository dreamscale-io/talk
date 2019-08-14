const Util = require("../Util");
const ChannelEmitDto = require("../dto/ChannelEmitDto");
const SimpleStatusDto = require("../dto/SimpleStatusDto");

module.exports = class ChannelEmit {
    constructor() {
        return (req, res) => {
            // res.send('POST request to homepage');
            try {
                let dtoReq = new ChannelEmitDto(req.body);
                let dtoRes = new SimpleStatusDto({
                    status: "SENT",
                    message: "message sent to group",
                });

                Util.logPostRequest("POST", req.url, dtoReq, dtoRes);

                res.send(dtoRes);
            } catch (e) {
                Util.logError(e, "POST", req.url);
                res.statusCode = 400;
                res.send(e.message);
            }
        }
    }
};
