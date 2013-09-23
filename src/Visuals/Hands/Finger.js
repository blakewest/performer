var params = require('./FingerMoveParams.js').params;

module.exports.Finger = function(Keyboard) {
  var pressAmount = 0.08; 
  this.originalY = 0.2; // this is just a default. each finger will actually overwrite this as necessary.
  this.pressedY = this.originalY - pressAmount;
  this.releaseSpeed = 0.05;
  this.moveSpeed = 0.1;
  // this.newX = this.model.position.x;
  // this.currentX = this.model.position.x;
  var keyboard = Keyboard;
  this.distances = params(keyboard);

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
    this.currentPos.y = this.model.position.y;
    this.currentPos.z = this.model.position.z;
    //logic about checking to see if neighbor is already on the note you want to play. 
    // debugger;
    var aboveNeighbor = this.model.parent.children[this.number+1].currentNote;
    var belowNeighbor = this.model.parent.children[this.number-1].currentNote;
    if (noteNum > this.model.currentNote) {
      if (aboveNeighbor === noteNum) {
        this.model.currentNote = noteNum-1;
      }else {
        this.model.currentNote = noteNum;
      }
    }
    else if (noteNum < this.model.currentNote) {
      if(belowNeighbor === noteNum) {
        this.model.currentNote = noteNum+1;
      }else {
        this.model.currentNote = noteNum;
      }
    }

    this.setNewPos(this.model.currentNote);
    console.log('Finger: ' + this.number + '/ Note: ' + this.model.currentNote);
    this.setUpNewTween();
  };

  this.update = function() {
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

  this.setNewPos = function(noteNum) {
    this.newPos.x = keyboard.keys[noteNum].model.position.x;
    this.newPos.y = keyboard.keys[noteNum].model.position.y + this.originalY;
    this.newPos.z = keyboard.keys[noteNum].model.position.z + 0.5;
  };

  this.setUpNewTween = function() {
    var _this = this;
    var update = function() {
      _this.model.position.x = _this.currentPos.x;
      _this.model.position.y = _this.currentPos.y+0.1;
      _this.model.position.z = _this.currentPos.z;
    };
    var easing = TWEEN.Easing.Quadratic.Out;

    var tween = new TWEEN.Tween(this.currentPos)
      .to(this.newPos, 150)
      .easing(easing)
      .onUpdate(update);

    tween.start();
  };
};






























