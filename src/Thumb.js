var Thumb = function(handInfo) {
  Finger.call(this);
  var thumbGeometry = new THREE.CubeGeometry(handInfo.thumbWidth, handInfo.thumbHeight, handInfo.thumbLength);
  var thumbMaterial = new THREE.MeshLambertMaterial({color: handInfo.thumbColor});
  var thumbPosition = new THREE.Vector3(8.260, 0.20, 0.6); // this first value is just hardcoded to put the finger directly on top of a note.
  this.model = new THREE.Mesh(thumbGeometry, thumbMaterial);
  this.model.position.copy(thumbPosition);
  this.originalY = thumbPosition.y;
};

Thumb.prototype = Object.create(Finger.prototype);
Thumb.prototype.constructor = Thumb;