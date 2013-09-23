var Finger = require('../Finger.js').Finger;

var LeftPinky = module.exports.LeftPinky = function(handInfo) {
  Finger.call(this, handInfo.keyboard);
  var pinkyGeometry = new THREE.CubeGeometry(handInfo.pinkyWidth, handInfo.pinkyHeight, handInfo.pinkyLength);
  var pinkyMaterial = new THREE.MeshLambertMaterial({color: handInfo.pinkyColor})
  var pinkyPosition = new THREE.Vector3(0, 0.20, 0.54);
  this.model = new THREE.Mesh(pinkyGeometry, pinkyMaterial);
  this.model.position.copy(pinkyPosition);
  this.originalY = pinkyPosition.y;
  this.number = 5;
  var dist = this.distances;

  this.moveAsNeeded = function(finger, newPosition, curNote, newNote) {
    var curX = this.currentPos.x;
    var delta = newPosition - curX;
    var curNote = this.model.currentNote;
    switch (finger) {
    case 5:
      this.ringRules(delta, curX, curNote, newNote);
      break;
    case 3:
      this.middleRules(delta,curX, curNote, newNote);
      break;
    case 2:
      this.indexRules(delta,curX, curNote, newNote);
      break;
    case 1:
      this.thumbRules(delta,curX, curNote, newNote);
    }
  };

  this.ringRules = function(delta, curX, curNote, newNote) {
    if ( delta > 0 && delta < dist.get(curNote, curNote+3)) { //this is like the 'stretch' zone
      return;
    } else { //definitely move
      this.moveToNote(newNote - 2);
    }
  };
  this.middleRules = function(delta, curX, curNote, newNote) {
    if ( delta > 0 && delta < dist.get(curNote, curNote + 5) ) {
      return;
    }else {
      this.moveToNote(newNote - 3);
    }
  };
  this.indexRules = function(delta, curX, curNote, newNote) {
    if ( delta > 0 && delta < dist.get(curNote, curNote + 7) ) {
      return;
    }else {
      this.moveToNote(newNote - 5);
    }
  };
  this.thumbRules = function(delta, curX, curNote, newNote) {
    if ( delta > 0 && delta < dist.get(curNote, curNote + 12) ) {
      return;
    } else if (delta > 0 && delta < dist.get(curNote, curNote + 1) ) {
      var _this = this;
      setTimeout(_this.moveToNote(newNote-7), 100);
    }
    else {
      this.moveToNote(newNote-7);
    }
  };
  this.setUpNewTween = function() {
    var _this = this;
    var update = function() {
      _this.model.position.x = _this.currentPos.x;
      _this.model.position.y = _this.currentPos.y +0.1;
      _this.model.position.z = _this.currentPos.z + 0.1;
    };
    var easing = TWEEN.Easing.Quadratic.Out;

    var tween = new TWEEN.Tween(this.currentPos)
      .to(this.newPos, 150)
      .easing(easing)
      .onUpdate(update);

    tween.start();
  };
};

LeftPinky.prototype = Object.create(Finger.prototype);
LeftPinky.prototype.constructor = LeftPinky;
