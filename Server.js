const chalk = require("chalk"),
    express = require("express"),
    bodyParser = require("body-parser"),
    socketIO = require("socket.io"),
    ChannelEmit = require("./resource/ChannelEmit");

const Server = (module.exports = class Server {
    constructor() {
        this.port = process.env.PORT || 5050;
        console.log(
            chalk.blue("Starting RealTime Flow...")
        );
        this.express = express()
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({extended: true}))
            .post("/channel/emit", new ChannelEmit())
            .listen(this.port, () => {
                console.log(`Listening on ${this.port}`);
            });

        const io = socketIO(this.express);
        io.on("connection", (socket) => {
            console.log("Client connected " + socket.id);
            socket.on("disconnect", (socket) => {
                console.log("Client disconnected " + socket.id)
            });
        });
        // this.resources = {
        //     channelEmit: new ChannelEmit(this.express, "/channel/emit")
        // };
        // this.express.listen(this.port);
    }
});

function start() {
    let server = new Server();
}

start();
