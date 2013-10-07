var PianoKey = require("./PianoKey.js").PianoKey;

module.exports.Keyboard = function(keyboardDesign) {
  // Keyboard design is a completed object where we've filled it out with note types and parameters. See keyboardDesign.js file for more.
  this.model = new THREE.Object3D();
  this.keys = [];
  var _this = this;

  // Build the actual keyboard
  for (var note = 0; note < keyboardDesign.keyInfo.length; note++) {
    var key = new PianoKey(keyboardDesign, note);
    _this.keys.push(key);
    if (note > 20 && note < 109) { // Strips to 88 keys
      this.model.add(key.model);
    }
  }
  this.model.position.y -= keyboardDesign.whiteKeyHeight / 2;
  // This centers the keyboard infront of the camera.
  this.model.traverse(function(object) {
    object.position.x -= 4.45;
  });

  this.press = function(note) {
    _this.keys[note].press();
  };

  this.release = function(note) {
    _this.keys[note].release();
  };

  this.update = function() {
    var _this = this;
    var allKeys = _this.keys;
    for (var i = 0; i < allKeys.length; i++) {
      allKeys[i].update();
    }
  };
};