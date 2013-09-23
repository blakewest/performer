var Finger = require('../Finger.js').Finger;

var RightIndex = module.exports.RightIndex = function(handInfo) {
  Finger.call(this, handInfo.keyboard);
  var indexFingerGeometry = new THREE.CubeGeometry(handInfo.indexFingerWidth, handInfo.indexFingerHeight, handInfo.indexFingerLength);
  var indexFingerMaterial = new THREE.MeshLambertMaterial({color: handInfo.indexFingerColor});
  var indexFingerPosition = new THREE.Vector3(0, 0.20, 0.4);
  this.model = new THREE.Mesh(indexFingerGeometry, indexFingerMaterial);
  this.model.position.copy(indexFingerPosition);
  this.originalY = indexFingerPosition.y;
  this.number = 2;
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
    case 3:
      this.middleRules(delta,curX, curNote, newNote);
      break;
    case 1:
      this.thumbRules(delta,curX, curNote, newNote);
    }
  };

  this.pinkyRules = function(delta, curX, curNote, newNote) {
    if ( delta > dist.get(curNote, curNote+4) && delta < dist.get(curNote, curNote+8)) { //this is like the 'stretch' zone
      return;
    } else { //definitely move
      this.moveToNote(newNote - 5);
    }
  };
  this.ringRules = function(delta, curX, curNote, newNote) {
    if ( delta > dist.get(curNote, curNote+3) && delta < dist.get(curNote, curNote+7) ) {
      return;
    }else {
      this.moveToNote(newNote-3);
    }
  };
  this.middleRules = function(delta, curX, curNote, newNote) {
    if ( delta > dist.get(curNote, curNote+2) && delta < dist.get(curNote, curNote+5) ) {
      return;
    }else {
      this.moveToNote(newNote-2);
    }
  };
  this.thumbRules = function(delta, curX, curNote, newNote) {
    if ( delta > dist.get(curNote, curNote-3) && delta < 0) {
      return;
    }else if (delta > 0 && delta < dist.get(curNote, curNote+3)) {
      var _this = this;
      setTimeout(_this.moveToNote(newNote+2), 100);
    }
    else {
      this.moveToNote(newNote+2);
    }
  };
};

RightIndex.prototype = Object.create(Finger.prototype);
RightIndex.prototype.constructor = RightIndex;
