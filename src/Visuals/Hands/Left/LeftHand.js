var LeftPinky        = require('./LeftPinky.js').LeftPinky;
var LeftRing         = require('./LeftRing.js').LeftRing;
var LeftMiddle     = require('./LeftMiddle.js').LeftMiddle;
var LeftIndex       = require('./LeftIndex.js').LeftIndex;
var LeftThumb    = require('./LeftThumb.js').LeftThumb;
var HandDesign  = require('../HandDesign.js').HandDesign;
var Dummy          = require('../Dummy.js').Dummy;

module.exports.LeftHand = function(keyboard) {
  var _this = this;
  //we're passing in the keyboard to the hand design. That way, the design/layout of the keyboard can be arbitrary, and each finger will know where to play a "C60", wherever it is.
  var handDesign = new HandDesign(keyboard);
  var pinky = new LeftPinky(handDesign, 'left');
  var ring = new LeftRing(handDesign, 'left');
  var middle = new LeftMiddle(handDesign, 'left');
  var index = new LeftIndex(handDesign, 'left');
  var thumb = new LeftThumb(handDesign, 'left');
  var dummy1 = new Dummy();
  var dummy2 = new Dummy();

  this.fingers = [];
  this.model = new THREE.Object3D();

  //add fingers to hand model
  this.fingers.push(undefined); // these are here to make off by 1 errors go away. We want finger 1 to be thumb so that semantically it makes sense)
  this.model.add(dummy1.model)
  dummy1.model.currentNote = -1;

  this.model.add(thumb.model);
  this.fingers.push(thumb);
  thumb.model.currentNote = 1;

  this.model.add(index.model);
  this.fingers.push(index);
  index.model.currentNote = 1;

  this.model.add(middle.model);
  this.fingers.push(middle);
  middle.model.currentNote = 1;

  this.model.add(ring.model);
  this.fingers.push(ring);
  ring.model.currentNote = 1;

  this.model.add(pinky.model);
  this.fingers.push(pinky);
  pinky.model.currentNote = 1;

  this.model.add(dummy2.model);
  dummy2.model.currentNote = 110;

  thumb.moveToNote(55);
  index.moveToNote(53);
  middle.moveToNote(52);
  ring.moveToNote(50);
  pinky.moveToNote(48);

  //set position of hand
  this.model.position.y -= 0.22 / 2;  // the 0.22 is the keyboard height (defined in KeyboardDesign.js)

  this.model.traverse(function(object) {
    object.position.x -= 4.1;
  });


  this.offSet = 0.2222;

  this.press = function(finger, noteNum) {
    finger = Math.abs(finger);
    console.log('the left ' + finger + ' finger is trying to press');
    var newPosition = keyboard.keys[noteNum].model.position.x;
    for (var i = 1; i <= 5; i++) {
      if (i === finger) {
        _this.fingers[i].press(noteNum);
      }else{
        _this.fingers[i].moveAsNeeded(finger, newPosition, noteNum);
      }
    }
  };

  this.release = function(finger) {
    finger = Math.abs(finger);
      _this.fingers[finger].release('left');
  };

  this.update = function() {
    var fingers = _this.fingers;
    for (var i = 1; i < fingers.length; i++) {
      fingers[i].update();
    }
  };
};
















