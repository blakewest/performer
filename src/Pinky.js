var Pinky = function(handInfo) {
  var pinkyGeometry = new THREE.CubeGeometry(handInfo.pinkyWidth, handInfo.pinkyHeight, handInfo.pinkyLength);
  var pinkyMaterial = new THREE.MeshLambertMaterial({color: handInfo.fingerColor})
  var pinkyPosition = new THREE.Vector3(9.204, 0.20, 0.4);
  this.model = new THREE.Mesh(pinkyGeometry, pinkyMaterial);
  this.model.position.copy(pinkyPosition);

  //set up animation functions
  var pressAmount = 0.08; 
  this.originalY = pinkyPosition.y;
  this.pressedY = this.originalY - pressAmount;
  this.releaseSpeed = 0.03;

  this.press = function() {
    console.log('pinky press is getting called');
    this.model.position.y = this.pressedY;
    this.isPressed = true;
  };
  this.release = function() {
    this.isPressed = false;
  };

  this.update = function() {
    if (this.model.position.y < this.originalY && this.isPressed === false) {
      var offset = this.originalY - this.model.position.y;
      this.model.position.y += Math.min(offset, this.releaseSpeed);
    }
  };
};