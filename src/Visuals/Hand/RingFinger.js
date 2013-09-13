var RingFinger = function(handInfo) {
  Finger.call(this);
  var ringFingerGeometry = new THREE.CubeGeometry(handInfo.ringFingerWidth, handInfo.ringFingerHeight, handInfo.ringFingerLength);
  var ringFingerMaterial = new THREE.MeshLambertMaterial({color: handInfo.ringFingerColor});
  var ringFingerPosition = new THREE.Vector3(8.968, 0.20, 0.45); // this first value is just hardcoded to put the finger directly on top of a note.
  this.model = new THREE.Mesh(ringFingerGeometry, ringFingerMaterial);
  this.model.position.copy(ringFingerPosition);
  this.originalY = ringFingerPosition.y;
};

RingFinger.prototype = Object.create(Finger.prototype);
RingFinger.prototype.constructor = RingFinger;