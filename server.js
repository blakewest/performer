var express = require('express');
var server = express();
var env = process.env.NODE_ENV || 'development'
var config = require('./config/config.js')[env];

//Sets up the static directory to serve from public.
//Side note: this automatically matches a get request of '/' to index.html.
server.configure(function() {
  server.use(express.static(__dirname + '/public'));
});

//Calls our routes file and passes the server and config object.
require('./routes.js').routes(server, config);

var port = process.env.PORT || config.port || 3000;

server.listen(port, function() {
  console.log('server is listening on port ', port);
});
