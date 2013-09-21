module.exports.Finger = function(Keyboard) {
  var pressAmount = 0.08; 
  this.originalY = 0.2; // this is just a default. each finger will actually overwrite this as necessary.
  this.pressedY = this.originalY - pressAmount;
  this.releaseSpeed = 0.05;
  this.moveSpeed = 0.1;
  // this.newX = this.model.position.x;
  // this.currentX = this.model.position.x;
  var keyboard = Keyboard;

  this.press = function(note) {
    this.moveToNote(note);
    this.model.position.y = this.pressedY;
    this.isPressed = true;
  };
  this.release = function() {
    this.isPressed = false;
  };

  this.moveToNote = function(noteNum) {
    this.currentPos.x = this.model.position.x;
    this.newPos.x = keyboard.keys[noteNum].model.position.x;
    this.setUpNewTween();
  };

  this.update = function(finger) {
    if (this.model.position.y < this.originalY && this.isPressed === false) {
      var offset = this.originalY - this.model.position.y;
      this.model.position.y += Math.min(offset, this.releaseSpeed);
    }
  };

  //just initializing values here. They'll get overwritten immediately;
  this.currentPos = {
    x: 0,
    y: 0,
    z: 0
  };

  this.newPos = {
    x: 0,
    y: 0,
    z: 0
  };

  this.setUpNewTween = function() {
    var _this = this;
    var update = function() {
      _this.model.position.x = _this.currentPos.x;
    };
    var easing = TWEEN.Easing.Quadratic.Out;

    var tween = new TWEEN.Tween(this.currentPos)
      .to(this.newPos, 300)
      .easing(easing)
      .onUpdate(update);

    tween.start();
  };
};


//need to call setUpTween whenever a new noteEvent comes in.
//prob want to have some conditional logic to only set up the tween when you actually move to a different note. 






























