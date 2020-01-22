/**
 * Application Metrics
 */
require('appmetrics-dash').attach();
var appmetrics = require('appmetrics');
var monitoring = appmetrics.monitor();
monitoring.on('initialized', function (env) {
  env = monitoring.getEnvironment();
  for (var entry in env) {
    console.log(entry + ':' + env[entry]);
  };
});

/**
 * DreamScale Server
 * @type {Server}
 */
const Server = require("./public/Server");
var server = new Server();
server.start();