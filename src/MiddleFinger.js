var MiddleFinger = function(handInfo) {
  Finger.call(this);
  var middleFingerGeometry = new THREE.CubeGeometry(handInfo.middleFingerWidth, handInfo.middleFingerHeight, handInfo.middleFingerLength);
  var middleFingerMaterial = new THREE.MeshLambertMaterial({color: handInfo.middleFingerColor});
  var middleFingerPosition = new THREE.Vector3(8.732, 0.20, 0.4); // this first value is just hardcoded to put the finger directly on top of a note.
  this.model = new THREE.Mesh(middleFingerGeometry, middleFingerMaterial);
  this.model.position.copy(middleFingerPosition);
  this.originalY = middleFingerPosition.y;
};

MiddleFinger.prototype = Object.create(Finger.prototype);
MiddleFinger.prototype.constructor = MiddleFinger;