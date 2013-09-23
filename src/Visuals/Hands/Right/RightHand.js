var RightPinky = require('./RightPinky.js').RightPinky;
var RightRing = require('./RightRing.js').RightRing;
var RightMiddle = require('./RightMiddle.js').RightMiddle;
var RightIndex = require('./RightIndex.js').RightIndex;
var RightThumb = require('./RightThumb.js').RightThumb;
var HandDesign = require('../HandDesign.js').HandDesign;

module.exports.RightHand = function(keyboard) {
  var _this = this;
  //we're passing in the keyboard to the hand design. That way, the design/layout of the keyboard can be arbitrary, and each finger will know where to play a "C60" or whatever.
  var handDesign = new HandDesign(keyboard); 
  var pinky = new RightPinky(handDesign, 'right');
  var ring = new RightRing(handDesign, 'right');
  var middle = new RightMiddle(handDesign, 'right');
  var index = new RightIndex(handDesign, 'right');
  var thumb = new RightThumb(handDesign, 'right');

  this.fingers = [];
  this.model = new THREE.Object3D();

  //add fingers to hand model
  this.fingers.push(undefined); // this is just here to make the off by 1 error go away. (We want finger 1 to be thumb so that semantically it makes sense)

  thumb.moveToNote(60);
  this.model.add(thumb.model);
  this.fingers.push(thumb);

  index.moveToNote(62);
  this.model.add(index.model);
  this.fingers.push(index);

  middle.moveToNote(64);
  this.model.add(middle.model);
  this.fingers.push(middle);

  ring.moveToNote(65);
  this.model.add(ring.model);
  this.fingers.push(ring);

  pinky.moveToNote(67);
  this.model.add(pinky.model);
  this.fingers.push(pinky);

  this.model.y -= 0.22 / 2; // the 0.22 is the keyboard height (defined in KeyboardDesign.js)

  this.press = function(finger, noteNum) {
    var newPosition = keyboard.keys[noteNum].model.position.x;
    for (var i = 1; i <= 5; i++) {
      if (i === finger) {
        _this.fingers[i].press(noteNum);
      }
      _this.fingers[i].moveAsNeeded(finger,newPosition, noteNum);
    }
  };

  this.release = function(finger) {
    console.log('the right ' + finger + ' finger is trying to release');
    _this.fingers[finger].release();
  };

  this.update = function() {
    var fingers = _this.fingers;
    for (var i = 1; i < fingers.length; i++) {
      fingers[i].update();
    }
  };
};