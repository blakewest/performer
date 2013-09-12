var Finger = function() {
  var pressAmount = 0.08; 
  this.originalY = 0.2; // this is just a default. each finger will actually overwrite this as necessary.
  this.pressedY = this.originalY - pressAmount;
  this.releaseSpeed = 0.03;

  this.press = function() {
    console.log('finger press is getting called');
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