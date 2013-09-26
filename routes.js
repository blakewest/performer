var mongoose = require('mongoose');
var express = require('express');

module.exports.routes = function(server, config) {
  require('./config/db.js').db(server, config);
  var Song = mongoose.model('Song', 'songs');
  server.use(express.bodyParser());

  server.post('/upload', function(req,res) {
    //TO DO: 
    //put the song data in the database
    res.writeHead(200);
    var jsonSongData = JSON.stringify(req.body.songData);
    var newSong = new Song({
      title: req.body.title,
      artist: req.body.artist,
      songData: jsonSongData
    });
    newSong.save();
    console.log('we theoretically just added a new song');
    res.end();
  });

  server.get('/songname', function(req,res) {
    //TO DO:
    //send song data back from the database
    Song.findOne({title: 'Hey Now'}, function(err, data) {
      var obj = JSON.parse(data.songData);
      console.log(obj.test);
    });
    res.writeHead(200);
    res.end();
  });
};