// var mongoose = require('mongoose');
var mongojs = require('mongojs');
var express = require('express');
var fs = require('fs');
var db = mongojs('mongodb://localhost/performer');
var collection = db.collection('songs');

module.exports.routes = function(server, config) {
  // require('./config/db.js').db(server, config);
  // var Song = mongoose.model('Song', 'songs');
  server.use(express.bodyParser());

  server.post('/upload', function(req,res) {
    //TO DO: 
    //put the song data in the database
    // console.log('replayer data at upload time is... ', JSON.stringify(req.body.songData));
    res.writeHead(200);
    // var newSong = new Song({
    //   title: req.body.title,
    //   artist: req.body.artist,
    //   songData: req.body.songData.toString(),
    // });
    // newSong.save();
    console.log('we theoretically just added a new song');
    collection.insert(req.body);
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
    collection.findOne({title: 'Last Modified: March 18, 1997'}, function(err, doc) {
      var stringData = JSON.stringify([doc.songData, doc.replayerData]);
      res.write(stringData);
      res.end();
    });
  });

  server.get('/songname2', function(req,res) {
    //TO DO:
    //send song data back from the database
    console.log('songname GET2 is called');
    res.writeHead(200, {
      'Content-Type' : 'text/plain'
    });
    res.end('bwv784.mid');
    // collection.findOne({title: 'Last Modified: March 18, 1997'}, function(err, doc) {
    //   var stringData = JSON.stringify([doc.songData, doc.replayerData]);
    //   res.write(stringData);
    //   res.end();
    // });
  });
};












