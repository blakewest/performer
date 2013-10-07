module.exports.HandDesign = function(keyboard) {
  // Pinky specs
  this.pinkyWidth = 0.14;
  this.pinkyHeight = 0.1;
  this.pinkyLength = 0.57;
  this.pinkyColor = 0xFF0000;

  // Ring finger specs
  this.ringFingerWidth = 0.18;
  this.ringFingerHeight = 0.1;
  this.ringFingerLength = 0.61;
  this.ringFingerColor = 0x006600;

  // Middle finger specs
  this.middleFingerWidth = 0.185;
  this.middleFingerHeight = 0.1;
  this.middleFingerLength = 0.7;
  this.middleFingerColor = 0x0033FF;

  // Index finger specs
  this.indexFingerWidth = 0.188;
  this.indexFingerHeight = 0.1;
  this.indexFingerLength = 0.60;
  this.indexFingerColor = 0xFFFF00;

  // Thumb specs
  this.thumbWidth = 0.175;
  this.thumbHeight = 0.1;
  this.thumbLength = 0.5;
  this.thumbColor = 0xFF33FF;

  this.keyboard = keyboard;
  this.keyboardHeight = 0.22;
};