var Finger = require('../Finger.js').Finger;

var LeftRing = module.exports.LeftRing = function(handInfo) {
  Finger.call(this, handInfo.keyboard);
  var ringFingerGeometry = new THREE.CubeGeometry(handInfo.ringFingerWidth, handInfo.ringFingerHeight, handInfo.ringFingerLength);
  var ringFingerMaterial = new THREE.MeshLambertMaterial({color: handInfo.ringFingerColor});
  var ringFingerPosition = new THREE.Vector3(0, 0.20, 0.45);
  this.model = new THREE.Mesh(ringFingerGeometry, ringFingerMaterial);
  this.model.position.copy(ringFingerPosition);
  this.originalY = ringFingerPosition.y;
  this.number = 4;
  var distances = this.distances;

  this.moveAsNeeded = function(finger, newPosition, newNote) {
    var curX = this.currentPos.x;
    var delta = newPosition - curX;
    switch (finger) {
    case 5:
      this.pinkyRules(delta, curX, newNote);
      break;
    case 3:
      this.middleRules(delta,curX,newNote);
      break;
    case 2:
      this.indexRules(delta,curX,newNote);
      break;
    case 1:
      this.thumbRules(delta,curX,newNote);
    }
  };

  this.pinkyRules = function(delta, curX, newNote) {
    if ( delta > distances[-3] && delta < distances[-2]) { //this is like the 'stretch' zone
      return;
    } else { //definitely move
      this.moveToNote(newNote + 2);
    }
  };
  this.middleRules = function(delta, curX, newNote) {
    if ( delta > 0 && delta < distances[3] ) {
      return;
    }else {
      this.moveToNote(newNote - 2);
    }
  };
  this.indexRules = function(delta, curX, newNote) {
    if ( delta > 0 && delta < distances[5] ) {
      return;
    }else {
      this.moveToNote(newNote - 3);
    }
  };
  this.thumbRules = function(delta, curX, newNote) {
    if ( delta > 0 && delta < distances[8] ) {
      return;
    } else if (delta > distances[-2] && delta < 0) {             //this is thumb crossing under
      var _this = this;
      setTimeout(_this.moveToNote(newNote - 5), 100);
    }
    else {
      this.moveToNote(newNote - 5);
    }
  };
};

LeftRing.prototype = Object.create(Finger.prototype);
LeftRing.prototype.constructor = LeftRing;
