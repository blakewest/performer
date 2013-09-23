var Finger = require('../Finger.js').Finger;

var LeftPinky = module.exports.LeftPinky = function(handInfo) {
  Finger.call(this, handInfo.keyboard);
  var pinkyGeometry = new THREE.CubeGeometry(handInfo.pinkyWidth, handInfo.pinkyHeight, handInfo.pinkyLength);
  var pinkyMaterial = new THREE.MeshLambertMaterial({color: handInfo.pinkyColor})
  var pinkyPosition = new THREE.Vector3(0, 0.20, 0.54);
  this.model = new THREE.Mesh(pinkyGeometry, pinkyMaterial);
  this.model.position.copy(pinkyPosition);
  this.originalY = pinkyPosition.y;
  var distances = this.distances;

  this.moveAsNeeded = function(finger, newPosition, newNote) {
    var curX = this.currentPos.x;
    var delta = newPosition - curX;
    switch (finger) {
    case 5:
      this.ringRules(delta, curX, newNote);
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

  this.ringRules = function(delta, curX, newNote) {
    if ( delta > 0 && delta < distances[3]) { //this is like the 'stretch' zone
      return;
    } else { //definitely move
      this.moveToNote(newNote - 2);
    }
  };
  this.middleRules = function(delta, curX, newNote) {
    if ( delta > 0 && delta < distances[5] ) {
      return;
    }else {
      this.moveToNote(newNote - 3);
    }
  };
  this.indexRules = function(delta, curX, newNote) {
    if ( delta > 0 && delta < distances[7] ) {
      return;
    }else {
      this.moveToNote(newNote - 5);
    }
  };
  this.thumbRules = function(delta, curX, newNote) {
    if ( delta > 0 && delta < distances[12] ) {
      return;
    } else if (delta > 0 && delta < distances[1]) {
      var _this = this;
      setTimeout(_this.moveToNote(newNote-7), 100);
    }
    else {
      this.moveToNote(newNote-7);
    }
  };
};

LeftPinky.prototype = Object.create(Finger.prototype);
LeftPinky.prototype.constructor = LeftPinky;
