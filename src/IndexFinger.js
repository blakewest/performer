var IndexFinger = function(handInfo) {
  Finger.call(this);
  var indexFingerGeometry = new THREE.CubeGeometry(handInfo.indexFingerWidth, handInfo.indexFingerHeight, handInfo.indexFingerLength);
  var indexFingerMaterial = new THREE.MeshLambertMaterial({color: handInfo.indexFingerColor});
  var indexFingerPosition = new THREE.Vector3(8.496, 0.20, 0.45); // this first value is just hardcoded to put the finger directly on top of a note.
  this.model = new THREE.Mesh(indexFingerGeometry, indexFingerMaterial);
  this.model.position.copy(indexFingerPosition);
  this.originalY = indexFingerPosition.y;
};

IndexFinger.prototype = Object.create(Finger.prototype);
IndexFinger.prototype.constructor = IndexFinger;