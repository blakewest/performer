var Finger = require('../Finger.js').Finger;

var LeftMiddle = module.exports.LeftMiddle = function(handInfo) {
  Finger.call(this, handInfo.keyboard);
  var middleFingerGeometry = new THREE.CubeGeometry(handInfo.middleFingerWidth, handInfo.middleFingerHeight, handInfo.middleFingerLength);
  var middleFingerMaterial = new THREE.MeshLambertMaterial({color: handInfo.middleFingerColor});
  var middleFingerPosition = new THREE.Vector3(0, 0.20, 0.4);
  this.model = new THREE.Mesh(middleFingerGeometry, middleFingerMaterial);
  this.model.position.copy(middleFingerPosition);
  this.originalY = middleFingerPosition.y;
  var distances = this.distances;

  this.moveAsNeeded = function(finger, newPosition, newNote) {
    var curX = this.currentPos.x;
    var delta = newPosition - curX;
    switch (finger) {
    case 5:
      this.pinkyRules(delta, curX, newNote);
      break;
    case 4:
      this.ringRules(delta,curX,newNote);
      break;
    case 2:
      this.indexRules(delta,curX,newNote);
      break;
    case 1:
      this.thumbRules(delta,curX,newNote);
    }
  };

  this.pinkyRules = function(delta, curX, newNote) {
    if ( delta > distances[-5] && delta < distances[-3]) { //this is like the 'stretch' zone
      return;
    } else { //definitely move
      this.moveToNote(newNote + 3);
    }
  };
  this.ringRules = function(delta, curX, newNote) {
    if ( delta > distances[-4] && delta < distances[-1] ) {
      return;
    }else {
      this.moveToNote(newNote - 2);
    }
  };
  this.indexRules = function(delta, curX, newNote) {
    if ( delta > distances[1] && delta < distances[3] ) {
      return;
    }else {
      this.moveToNote(newNote - 2);
    }
  };
  this.thumbRules = function(delta, curX, newNote) {
    if ( delta > 0 && delta < distances[6] ) {
      return;
    } else if (delta > distances[-4] && delta < 0) {    //this is the thumb crossing under
      var _this = this;
      setTimeout(_this.moveToNote(newNote-3), 100);
    }
    else {
      this.moveToNote(newNote-3);
    }
  };
};

LeftMiddle.prototype = Object.create(Finger.prototype);
LeftMiddle.prototype.constructor = LeftMiddle;
