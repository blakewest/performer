var Pinky = require('./Pinky.js').Pinky;
var RingFinger = require('./RingFinger.js').RingFinger;
var MiddleFinger = require('./MiddleFinger.js').MiddleFinger;
var IndexFinger = require('./IndexFinger.js').IndexFinger;
var Thumb = require('./Thumb.js').Thumb;
var HandDesign = require('./HandDesign.js').HandDesign;

module.exports.RightHand = function() {
  var _this = this;
  var handDesign = new HandDesign();
  var ringFinger = new RingFinger(handDesign);
  var pinky = new Pinky(handDesign);
  var middleFinger = new MiddleFinger(handDesign);
  var indexFinger = new IndexFinger(handDesign);
  var thumb = new Thumb(handDesign);

  this.fingers = [];
  this.model = new THREE.Object3D();

  //add fingers to hand model
  this.fingers.push(undefined); // this is just here to make the off by 1 error go away. (We want finger 1 to be thumb so that semantically it makes sense)

  this.model.add(thumb.model);
  this.fingers.push(thumb);

  this.model.add(indexFinger.model);
  this.fingers.push(indexFinger);

  this.model.add(middleFinger.model);
  this.fingers.push(middleFinger);

  this.model.add(ringFinger.model);
  this.fingers.push(ringFinger);

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