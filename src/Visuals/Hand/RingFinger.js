var Finger = require('./Finger.js').Finger;

var RingFinger = module.exports.RingFinger = function(handInfo) {
  Finger.call(this, handInfo.keyboard);
  var ringFingerGeometry = new THREE.CubeGeometry(handInfo.ringFingerWidth, handInfo.ringFingerHeight, handInfo.ringFingerLength);
  var ringFingerMaterial = new THREE.MeshLambertMaterial({color: handInfo.ringFingerColor});
  var ringFingerPosition = new THREE.Vector3(0, 0.20, 0.45);
  this.model = new THREE.Mesh(ringFingerGeometry, ringFingerMaterial);
  this.model.position.copy(ringFingerPosition);
  this.originalY = ringFingerPosition.y;
};

RingFinger.prototype = Object.create(Finger.prototype);
RingFinger.prototype.constructor = RingFinger;