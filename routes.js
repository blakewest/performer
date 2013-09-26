var mongoose = require('mongoose');
var express = require('express');
var fs = require('fs');

module.exports.routes = function(server, config) {
  require('./config/db.js').db(server, config);
  var Song = mongoose.model('Song', 'songs');
  server.use(express.bodyParser());

  server.post('/upload', function(req,res) {
    //TO DO: 
    //put the song data in the database
    console.log('replayer data at upload time is... ', JSON.stringify(req.body.replayerData));
    res.writeHead(200);
    var newSong = new Song({
      title: req.body.title,
      artist: req.body.artist,
      songData: JSON.stringify(req.body.songData),
      replayerData: JSON.stringify(req.body.replayerData)
    });
    newSong.save();
    console.log('we theoretically just added a new song');
    res.end();
  });

  server.get('/bwv784.mid', function(req,res) {
    res.writeHead(200);
    fs.readFile('./TestMidiFiles/bwv784.mid', function(err, data) {
      // var stringified = data.toString();
      res.end(data);
    });
  });

  server.get('/songname', function(req,res) {
    //TO DO:
    //send song data back from the database
    console.log('songname GET is called');
    res.writeHead(200, {
      'Content-Type' : 'text/plain'
    });
    res.end('bwv784.mid');
    // Song.findOne({title: 'Grand Piano'}, function(err, data) {
    //   var info = [data.songData, data.replayerData]
    //   var result = JSON.stringify(info);
    //   res.write(result);
    //   res.end();
    // });
  });
};