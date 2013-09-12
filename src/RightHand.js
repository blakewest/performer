var RightHand = function(pinky, ringFinger, middleFinger, indexFinger, thumb) {
  // set up cubes and materials for each finger
  //set their positions just above middle C position
  //probably use something similar to the keys themselves interms of shapes and such.
  var _this = this;

  this.fingers = [];
  this.model = new THREE.Object3D();
  //add fingers to hand model
  this.fingers.push(pinky); // this is just here to make the off by 1 error go away. will take out soon.

  this.model.add(thumb.model);
  this.fingers.push(thumb);

  this.model.add(indexFinger.model);
  this.fingers.push(indexFinger);

  this.model.add(middleFinger.model);
  this.fingers.push(middleFinger);

  this.model.add(ringFinger.model);
  this.fingers.push(ringFinger);

  this.model.add(pinky.model);
  this.fingers.push(pinky);


  //set position of hand
  this.model.y -= 0.22 / 2;  // the 0.22 is the keyboard height (defined in KeyboardDesign.js)

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