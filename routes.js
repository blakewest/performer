// var mongoose = require('mongoose');
var mongojs = require('mongojs');
var express = require('express');
var fs = require('fs');

module.exports.routes = function(server, config) {
  var db = mongojs(config.db);
  var collection = db.collection('songs');
  server.use(express.bodyParser());

  //put the whole object in the db. This will contain a title, artist, and best path obj. (computed fingering data);
  server.post('/upload', function(req,res) {
    res.writeHead(200);
    collection.insert(req.body);
    res.end();
  });

  //actually sends back the midi files we have stored on the server.
  server.get('/files/:song', function(req,res) {
    res.writeHead(200);
    fs.readFile('./TestMidiFiles/' + req.params.song, function(err, data) {
      res.end(data);
    });
  });

  //send back all best path objs we have in one request, so we don't need to make multiple requests as we get new songs.
  server.get('/getAllPaths', function(req,res) {
    collection.find(function(err, docs) {
      if (err) {
        res.json([]);
      } else {
        res.json(docs);
      }
    });
  });

  //hand back requested song name, so the XHTTP object on client can use that to request the real file.
  //We don't just send back the file straight up because the XHTTP has special functions it uses
  server.get('/songs/:song', function(req,res) {
    res.writeHead(200, {
      'Content-Type' : 'text/plain'
    });
    res.end(req.params.song + '.mid');
  });
};












