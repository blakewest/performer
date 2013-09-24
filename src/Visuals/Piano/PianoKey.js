var PianoKey = module.exports.PianoKey = function(boardInfo, note) {
  //set up some convenience vars
  var Black                    = boardInfo.KeyType.Black;
  var keyType               = boardInfo.keyInfo[note].keyType;
  var keyCenterPosX     = boardInfo.keyInfo[note].keyCenterPosX;
  var keyUpSpeed         = boardInfo.keyUpSpeed;

  //set up necessary components for making a Mesh.
  var geometry, material, position;
  if (keyType === Black) {
    geometry = new THREE.CubeGeometry(boardInfo.blackKeyWidth, boardInfo.blackKeyHeight, boardInfo.blackKeyLength);
    material   = new THREE.MeshPhongMaterial({color: boardInfo.blackKeyColor});
    position   = new THREE.Vector3(keyCenterPosX, boardInfo.blackKeyPosY, boardInfo.blackKeyPosZ);
    this.originalColor = {r: 0, g: 0, b: 0};
  }else {
    geometry = new THREE.CubeGeometry(boardInfo.whiteKeyWidth, boardInfo.whiteKeyHeight, boardInfo.whiteKeyLength);
    material   = new THREE.MeshPhongMaterial( {color: boardInfo.whiteKeyColor, emissive: 0x111111} );
    position   = new THREE.Vector3(keyCenterPosX, boardInfo.whiteKeyPosY, boardInfo.whiteKeyPosZ);
    this.originalColor = {r: 0.941, g: 1, b: 1};
  }

  //make the key Mesh
  this.model = new THREE.Mesh(geometry, material);
  this.model.position.copy(position);

  //set helper properties
  this.keyUpSpeed = boardInfo.keyUpSpeed;
  this.originalY = position.y;
  this.pressedY = this.originalY - boardInfo.keyDip;
  this.newColor = {r: 0, g: 0, b: 0};
  this.currentColor = {r: this.originalColor.r, g: this.originalColor.g, b: this.originalColor.b}; //weird syntax here so original color never gets modified. 
};

PianoKey.prototype.press = function() {
  this.model.position.y = this.pressedY;
  this.newColor = {r: 0.145, g: 0.749, b: 0.854};
  this.setUpNewTween();
  this.isPressed = true;
};

PianoKey.prototype.release = function() {
  this.isPressed = false;
  this.newColor = this.originalColor;
  this.setUpNewTween();
};

PianoKey.prototype.update = function() {
  //this is really about making released notes edge up slowly, rather than quickly
  if (this.model.position.y < this.originalY && this.isPressed === false) {
    //offset will keep getting smaller as the model's position gets raised by keyUpSpeed because update runs 60 times/second.
    var offset = this.originalY - this.model.position.y;
    this.model.position.y += Math.min(offset, this.keyUpSpeed);
  }
};

PianoKey.prototype.setUpNewTween = function() {
  var _this = this;
  var update = function() {
    _this.model.material.color.setRGB(_this.currentColor.r, _this.currentColor.g, _this.currentColor.b);
  };
  var easing = TWEEN.Easing.Quadratic.Out;

  var tween = new TWEEN.Tween(this.currentColor)
    .to(this.newColor, 150)
    .easing(easing)
    .onUpdate(update);

  tween.start();
};