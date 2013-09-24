var RightPinky = require('./RightPinky.js').RightPinky;
var RightRing = require('./RightRing.js').RightRing;
var RightMiddle = require('./RightMiddle.js').RightMiddle;
var RightIndex = require('./RightIndex.js').RightIndex;
var RightThumb = require('./RightThumb.js').RightThumb;
var HandDesign = require('../HandDesign.js').HandDesign;
var Dummy         = require('../Dummy.js').Dummy;

module.exports.RightHand = function(keyboard) {
  var _this = this;
  //we're passing in the keyboard to the hand design. That way, the design/layout of the keyboard can be arbitrary, and each finger will know where to play a "C60" or whatever.
  var handDesign = new HandDesign(keyboard); 
  var pinky = new RightPinky(handDesign, 'right');
  var ring = new RightRing(handDesign, 'right');
  var middle = new RightMiddle(handDesign, 'right');
  var index = new RightIndex(handDesign, 'right');
  var thumb = new RightThumb(handDesign, 'right');
  var dummy1 = new Dummy();
  var dummy2 = new Dummy();

  this.fingers = [];
  this.model = new THREE.Object3D();

  //add fingers to hand model

  this.fingers.push(undefined); // these are here to make the off by 1 errors go away. (We want finger 1 to be thumb so that semantically it makes sense)
  this.model.add(dummy1.model)
  dummy1.model.currentNote = -1;

  this.model.add(thumb.model);
  this.fingers.push(thumb);
  thumb.model.currentNote = 5;

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

  thumb.moveToNote(60);
  index.moveToNote(62);
  middle.moveToNote(64);
  ring.moveToNote(65);
  pinky.moveToNote(67);

  this.model.position.y -= 0.22 / 2; // the 0.22 is the keyboard height (defined in KeyboardDesign.js)
  this.model.traverse(function(object) {
    object.position.x -= 4.1;
  });

  console.log('RH object: ', this.model);

  this.press = function(finger, noteNum) {
    // console.log('the right ' + finger + ' finger is trying to press');
    var newPosition = keyboard.keys[noteNum].model.position.x;
    for (var i = 1; i <= 5; i++) {
      if (i === finger) {
        _this.fingers[i].press(noteNum);
      }else{
        _this.fingers[i].moveAsNeeded(finger,newPosition, noteNum);
      }
    }
  };

  this.release = function(finger) {
    _this.fingers[finger].release();
  };

  this.update = function() {
    var fingers = _this.fingers;
    for (var i = 1; i < fingers.length; i++) {
      fingers[i].update();
    }
  };
};