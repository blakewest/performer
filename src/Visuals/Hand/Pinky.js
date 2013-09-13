var Pinky = function(handInfo) {
  Finger.call(this);
  var pinkyGeometry = new THREE.CubeGeometry(handInfo.pinkyWidth, handInfo.pinkyHeight, handInfo.pinkyLength);
  var pinkyMaterial = new THREE.MeshLambertMaterial({color: handInfo.pinkyColor})
  var pinkyPosition = new THREE.Vector3(9.204, 0.20, 0.54);
  this.model = new THREE.Mesh(pinkyGeometry, pinkyMaterial);
  this.model.position.copy(pinkyPosition);
  this.originalY = pinkyPosition.y;
};

Pinky.prototype = Object.create(Finger.prototype);
Pinky.prototype.constructor = Pinky;
