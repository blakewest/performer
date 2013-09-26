var express = require('express');
var server = express();
var env = process.env.NODE_ENV || 'development'
var config = require('./config/config.js')[env];

//sets up the static directory to serve from public. 
//side note: this automatically matches a get request of '/' to index.html. 
server.configure(function() {
  server.use(express.static(__dirname + '/public'));
});

//calls our routes file and passes the server and config object.
require('./routes.js').routes(server, config);

var port = process.env.PORT || config.port || 3000;

console.log('server is listening on port ', port);
server.listen(port);
