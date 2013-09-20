var Finger = require('./Finger.js').Finger;

var MiddleFinger = module.exports.MiddleFinger = function(handInfo) {
  Finger.call(this, handInfo.keyboard);
  var middleFingerGeometry = new THREE.CubeGeometry(handInfo.middleFingerWidth, handInfo.middleFingerHeight, handInfo.middleFingerLength);
  var middleFingerMaterial = new THREE.MeshLambertMaterial({color: handInfo.middleFingerColor});
  var middleFingerPosition = new THREE.Vector3(0, 0.20, 0.4);
  this.model = new THREE.Mesh(middleFingerGeometry, middleFingerMaterial);
  this.model.position.copy(middleFingerPosition);
  this.originalY = middleFingerPosition.y;
};

MiddleFinger.prototype = Object.create(Finger.prototype);
MiddleFinger.prototype.constructor = MiddleFinger;