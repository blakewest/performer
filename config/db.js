var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports.db = function(server, config) {
  mongoose.connect(config.db);

  var songSchema = new Schema({
    title: String,
    artist: String,
    songData: String
  });

  var Song = mongoose.model('Song', songSchema);
};