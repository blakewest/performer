var Finger = require('../Finger.js').Finger;

var RightMiddle = module.exports.RightMiddle = function(handInfo) {
  Finger.call(this, handInfo.keyboard);
  var middleFingerGeometry = new THREE.CubeGeometry(handInfo.middleFingerWidth, handInfo.middleFingerHeight, handInfo.middleFingerLength);
  var middleFingerMaterial = new THREE.MeshLambertMaterial({color: handInfo.middleFingerColor});
  var middleFingerPosition = new THREE.Vector3(0, 0.20, 0.4);
  this.model = new THREE.Mesh(middleFingerGeometry, middleFingerMaterial);
  this.model.position.copy(middleFingerPosition);
  this.originalY = middleFingerPosition.y;
  this.number = 3;
  var dist = this.distances;

  this.moveAsNeeded = function(finger, newPosition, newNote) {
    var curX = this.currentPos.x;
    var delta = newPosition - curX;
    var curNote = this.model.currentNote;
    switch (finger) {
    case 5:
      this.pinkyRules(delta, curX, curNote, newNote);
      break;
    case 4:
      this.ringRules(delta,curX, curNote, newNote);
      break;
    case 2:
      this.indexRules(delta,curX, curNote, newNote);
      break;
    case 1:
      this.thumbRules(delta,curX, curNote, newNote);
    }
  };

  this.pinkyRules = function(delta, curX, curNote, newNote) {
    if ( delta >= dist.get(curNote, curNote+3) && delta <= dist.get(curNote, curNote+5)) { // This is like the 'stretch' zone
      return;
    } else { // Definitely move
      this.moveToNote(newNote - 3);
    }
  };
  this.ringRules = function(delta, curX, curNote, newNote) {
    if ( delta >= dist.get(curNote, curNote+1) && delta <= dist.get(curNote, curNote+4) ) {
      return;
    }else {
      this.moveToNote(newNote - 2);
    }
  };
  this.indexRules = function(delta, curX, curNote, newNote) {
    if ( delta >= dist.get(curNote, curNote-3) && delta <= dist.get(curNote, curNote-1) ) {
      return;
    }else {
      this.moveToNote(newNote + 2);
    }
  };
  this.thumbRules = function(delta, curX, curNote, newNote) {
    if ( delta >= dist.get(curNote, curNote-6) && delta < 0 ) {
      return;
    } else if (delta > 0 && delta < dist.get(curNote, curNote+4)) {
      var _this = this;
      setTimeout(_this.moveToNote(newNote+3), 100);
    }
    else {
      this.moveToNote(newNote+3);
    }
  };
};

RightMiddle.prototype = Object.create(Finger.prototype);
RightMiddle.prototype.constructor = RightMiddle;
