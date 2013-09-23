var LeftPinky = require('./LeftPinky.js').LeftPinky;
var LeftRing = require('./LeftRing.js').LeftRing;
var LeftMiddle = require('./LeftMiddle.js').LeftMiddle;
var LeftIndex = require('./LeftIndex.js').LeftIndex;
var LeftThumb = require('./LeftThumb.js').LeftThumb;
var HandDesign = require('../HandDesign.js').HandDesign;

module.exports.LeftHand = function(keyboard) {
  var _this = this;
  //we're passing in the keyboard to the hand design. That way, the design/layout of the keyboard can be arbitrary, and each finger will know where to play a "C60", wherever it is.
  var handDesign = new HandDesign(keyboard);
  var pinky = new LeftPinky(handDesign, 'left');
  var ring = new LeftRing(handDesign, 'left');
  var middle = new LeftMiddle(handDesign, 'left');
  var index = new LeftIndex(handDesign, 'left');
  var thumb = new LeftThumb(handDesign, 'left');

  this.fingers = [];
  this.model = new THREE.Object3D();

  //add fingers to hand model
  this.fingers.push(undefined); // this is just here to make the off by 1 error go away. (We want finger 1 to be thumb so that semantically it makes sense)

  thumb.moveToNote(55);
  this.model.add(thumb.model);
  this.fingers.push(thumb);

  index.moveToNote(53);
  this.model.add(index.model);
  this.fingers.push(index);

  middle.moveToNote(52);
  this.model.add(middle.model);
  this.fingers.push(middle);

  ring.moveToNote(50);
  this.model.add(ring.model);
  this.fingers.push(ring);

  pinky.moveToNote(48);
  this.model.add(pinky.model);
  this.fingers.push(pinky);

  //set position of hand
  this.model.y -= 0.22 / 2;  // the 0.22 is the keyboard height (defined in KeyboardDesign.js)

  this.offSet = 0.2222;

  this.press = function(finger, noteNum) {
    finger = Math.abs(finger);
    var newPosition = keyboard.keys[noteNum].model.position.x;
    for (var i = 1; i <= 5; i++) {
      if (i === finger) {
        _this.fingers[i].press(noteNum);
      }
      _this.fingers[i].moveAsNeeded(finger,newPosition, noteNum);
    }
  };

  this.release = function(finger) {
    finger = Math.abs(finger);
    console.log('the left ' + finger + ' finger is trying to release');
    _this.fingers[finger].release('left');
  };

  this.update = function() {
    var fingers = _this.fingers;
    for (var i = 1; i < fingers.length; i++) {
      fingers[i].update();
    }
  };
};
















