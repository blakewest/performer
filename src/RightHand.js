var RightHand = function(handInfo) {
  // set up cubes and materials for each finger
  //set their positions just above middle C position
  //probably use something similar to the keys themselves interms of shapes and such.

  this.model = new THREE.Object3D();


  // SET UP PINKY
  var pinkyGeometry = new THREE.CubeGeometry(handInfo.pinkyWidth, handInfo.pinkyHeight, handInfo.pinkyLength);
  var pinkyMaterial = new THREE.MeshLambertMaterial({color: handInfo.fingerColor})
  var pinkyPosition = new THREE.Vector3(9.204, 0.20, 0.4);
  var pinky = new THREE.Mesh(pinkyGeometry, pinkyMaterial);
  pinky.position.copy(pinkyPosition);

  //add fingers to hand model
  this.model.add(pinky);

  //set position of hand
  this.model.y -= handInfo.keyboardHeight / 2;
};