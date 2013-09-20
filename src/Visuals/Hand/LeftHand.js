var Pinky = require('./Pinky.js').Pinky;
var RingFinger = require('./RingFinger.js').RingFinger;
var MiddleFinger = require('./MiddleFinger.js').MiddleFinger;
var IndexFinger = require('./IndexFinger.js').IndexFinger;
var Thumb = require('./Thumb.js').Thumb;
var HandDesign = require('./HandDesign.js').HandDesign;

module.exports.LeftHand = function(keyboard) {
  var _this = this;
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

  //set position of hand
  this.model.y -= 0.22 / 2;  // the 0.22 is the keyboard height (defined in KeyboardDesign.js)

  this.press = function(finger) {
    console.log('the ' + finger + ' finger is trying to press');
    _this.fingers[finger].press();
  };

  this.release = function(finger) {
    console.log('the ' + finger + ' finger is trying to release');
    _this.fingers[finger].release();
  };

  this.update = function() {
    var fingers = _this.fingers;
    for (var i = 1; i < fingers.length; i++) {
      fingers[i].update();
    }
  };

};