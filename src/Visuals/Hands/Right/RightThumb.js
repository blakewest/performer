var Finger = require('../Finger.js').Finger;

var RightThumb = module.exports.RightThumb = function(handInfo) {
  Finger.call(this, handInfo.keyboard);
  var thumbGeometry = new THREE.CubeGeometry(handInfo.thumbWidth, handInfo.thumbHeight, handInfo.thumbLength);
  var thumbMaterial = new THREE.MeshLambertMaterial({color: handInfo.thumbColor});
  var thumbPosition = new THREE.Vector3(0, 0.30, 0.6);
  this.model = new THREE.Mesh(thumbGeometry, thumbMaterial);
  this.model.position.copy(thumbPosition);
  this.originalY = thumbPosition.y;
  this.number = 1;
  var dist = this.distances;

  this.moveAsNeeded = function(finger, newPosition, newNote) {
    var curX = this.currentPos.x;
    var delta = newPosition - curX;
    var curNote = this.model.currentNote;
    switch (finger) {
    case 5:
      this.pinkyRules(delta, curX, curNote, newNote);
      break;
    case 4:
      this.ringRules(delta, curX, curNote, newNote);
      break;
    case 3:
      this.middleRules(delta, curX, curNote, newNote);
      break;
    case 2:
      this.indexRules(delta, curX, curNote, newNote);
    }
  };

  this.pinkyRules = function(delta, curX, curNote, newNote) {
    debugger;
    if ( delta > dist.get(curNote, curNote + 5) && delta < dist.get(curNote, curNote + 12) ) { //this is like the 'stretch' zone
      return;
    }else if (delta > dist[-2] && delta < 0) { //this is when the index lightly crosses over thumb
      var _this = this;
      setTimeout(_this.moveToNote(newNote-7), 100);
    }else { //definitely move
      this.moveToNote(newNote - 7);
    }
  };
  this.ringRules = function(delta, curX, curNote, newNote) {
    if ( delta > dist[4] && delta <= dist[9] ) {
      return;
    }else if (delta > dist[-2] && delta < 0) { //this is when the index lightly crosses over thumb
      var _this = this;
      setTimeout(_this.moveToNote(newNote-5), 100);
    }else {
      this.moveToNote(newNote - 5);
    }
  };
  this.middleRules = function(delta, curX, curNote, newNote) {
    if ( delta > dist[2] && delta < dist[7] ) {
      return;
    }else if (delta > dist[-3] && delta < 0) { //this is when the index lightly crosses over thumb
      var _this = this;
      setTimeout(_this.moveToNote(newNote - 4), 100);
    }else {
      this.moveToNote(newNote - 4);
    }
  };
  this.indexRules = function(delta, curX, curNote, newNote) {
    if ( delta > 0 && delta < dist[4] ) {
      return;
    }else if (delta > dist[-2] && delta < 0) { //this is when the index lightly crosses over thumb
      var _this = this;
      setTimeout(_this.moveToNote(newNote-2), 100);
    }else {
      this.moveToNote(newNote-2);
    }
  };
  this.setUpNewTween = function() {
    var _this = this;
    var update = function() {
      _this.model.position.x = _this.currentPos.x;
      _this.model.position.y = _this.currentPos.y + 0.1;
      _this.model.position.z = _this.currentPos.z + 0.2;
    };
    var easing = TWEEN.Easing.Quadratic.Out;

    var tween = new TWEEN.Tween(this.currentPos)
      .to(this.newPos, 150)
      .easing(easing)
      .onUpdate(update);

    tween.start();
  };
};

RightThumb.prototype = Object.create(Finger.prototype);
RightThumb.prototype.constructor = RightThumb;
