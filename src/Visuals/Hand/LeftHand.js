var Pinky = require('./Pinky.js').Pinky;
var RingFinger = require('./RingFinger.js').RingFinger;
var MiddleFinger = require('./MiddleFinger.js').MiddleFinger;
var IndexFinger = require('./IndexFinger.js').IndexFinger;
var Thumb = require('./Thumb.js').Thumb;
var HandDesign = require('./HandDesign.js').HandDesign;

module.exports.LeftHand = function(keyboard) {
  var _this = this;
  //we're passing in the keyboard to the hand design. That way, the design/layout of the keyboard can be arbitrary, and each finger will know where to play a "C60", wherever it is.
  var handDesign = new HandDesign(keyboard);
  var pinky = new Pinky(handDesign, 'left');
  var ring = new RingFinger(handDesign, 'left');
  var middle = new MiddleFinger(handDesign, 'left');
  var index = new IndexFinger(handDesign, 'left');
  var thumb = new Thumb(handDesign, 'left');

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

  this.currentPos = {
    x: 0,
    y: 0, 
    z: 0
  };

  this.newPos = {
    x: 0,
    y: 0,
    z: 0
  };

  //set position of hand
  this.model.y -= 0.22 / 2;  // the 0.22 is the keyboard height (defined in KeyboardDesign.js)

  this.offSet = 0.2222;

  this.press = function(finger, noteNum) {
    finger = Math.abs(finger);
    _this.currentPos.x = _this.model.position.x;
    var newPosition = keyboard.keys[noteNum].model.position.x;
    var oldPosition = _this.fingers[finger].currentPos.x;
    var delta = newPosition - oldPosition;
    if (delta > _this.currentPos.x) {
      _this.setAscNewPos(delta, finger);
    }else {
      _this.setDescNewPos(delta, finger);
    }
    _this.setUpNewTween();
    _this.fingers[finger].press(noteNum);
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

  this.setUpNewTween = function() {
    var update = function() {
      _this.model.position.x = _this.currentPos.x;
    };
    var easing = TWEEN.Easing.Quadratic.Out;

    var tween = new TWEEN.Tween(_this.currentPos)
      .to(_this.newPos, 300)
      .easing(easing)
      .onUpdate(update);

    tween.start();
  };

  this.setAscNewPos = function(delta, finger) {
    console.log('current RH x pos: ', _this.currentPos.x);
    _this.newPos.x = delta + (_this.offSet * (3-finger));
  };

  this.setDescNewPos = function(delta, finger) {
    _this.newPos.x = delta + (_this.offSet * (finger - 3));
  };

};
















