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

//save pre-computed song files in the DB with following properties:
  //title
  //artist
  //pre-computed data

//on client side
  //have logic to set replayer data to the stuff we just got from server. 
  //no need for local storage. 
  //just have a script that lazy loads all songs from the DB.

//server side
  //to get files on server, we could save the finished root.data to a variable, and then send a post-request with stringified data.
  //with a copy of the data. then just manually add a name/artist property later. *do it the dumb way for now*

var port = process.env.PORT || config.port || 3000;

console.log('server is listening on port ', port);
server.listen(port);
