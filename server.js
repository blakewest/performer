var express = require('express');
var server = express();

server.configure(function() {
  server.use(express.static(__dirname + '/public'));
});

var port = 3000;
console.log('server is listening on port ', port);
server.listen(port);
