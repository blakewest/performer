var RightHand = function(pinky) {
  // set up cubes and materials for each finger
  //set their positions just above middle C position
  //probably use something similar to the keys themselves interms of shapes and such.
  var _this = this;

  this.fingers = [];
  this.model = new THREE.Object3D();
  //add fingers to hand model
  this.model.add(pinky.model);
  this.fingers.push(pinky);

  //set position of hand
  // this.model.y -= handInfo.keyboardHeight / 2;
  this.model.y -= 0.22 / 2;

  this.press = function(finger) {
    _this.fingers[finger].press();
  };

  this.release = function(finger) {
    _this.fingers[finger].release();
  };

  this.update = function() {
    var fingers = _this.fingers;
    for (var i = 0; i < fingers.length; i++) {
      fingers[i].update();
    }
  };

};