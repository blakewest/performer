var Finger = require('../Finger.js').Finger;

var LeftMiddle = module.exports.LeftMiddle = function(handInfo) {
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
      this.ringRules(delta, curX, curNote, newNote);
      break;
    case 2:
      this.indexRules(delta, curX, curNote, newNote);
      break;
    case 1:
      this.thumbRules(delta, curX, curNote, newNote);
    }
  };

  this.pinkyRules = function(delta, curX, curNote, newNote) {
    if ( delta > dist.get(curNote, curNote-5) && delta < dist.get(curNote, curNote-3) ) { //this is like the 'stretch' zone
      return;
    } else { //definitely move
      this.moveToNote(newNote+3);
    }
  };
  this.ringRules = function(delta, curX, curNote, newNote) {
    if ( delta > dist.get(curNote, curNote-4) && delta < dist.get(curNote, curNote-1) ) {
      return;
    }else {
      this.moveToNote(newNote+2);
    }
  };
  this.indexRules = function(delta, curX, curNote, newNote) {
    if ( delta > 0 && delta < dist.get(curNote, curNote+3) ) {
      return;
    }else {
      this.moveToNote(newNote-2);
    }
  };
  this.thumbRules = function(delta, curX, curNote, newNote) {
    if ( delta > 0 && delta < dist.get(curNote, curNote+6) ) {
      return;
    } else if (delta > dist.get(curNote, curNote-4) && delta < 0) {    //this is the thumb crossing under
      var _this = this;
      setTimeout(_this.moveToNote(newNote-3), 100); //this is so you have some delay before the fingers move back over the thumb. A tad more realistic
    }
    else {
      this.moveToNote(newNote-3);
    }
  };
};

LeftMiddle.prototype = Object.create(Finger.prototype);
LeftMiddle.prototype.constructor = LeftMiddle;
