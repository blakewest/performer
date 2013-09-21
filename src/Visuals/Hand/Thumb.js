var Finger = require('./Finger.js').Finger;

var Thumb = module.exports.Thumb = function(handInfo) {
  Finger.call(this, handInfo.keyboard);
  var thumbGeometry = new THREE.CubeGeometry(handInfo.thumbWidth, handInfo.thumbHeight, handInfo.thumbLength);
  var thumbMaterial = new THREE.MeshLambertMaterial({color: handInfo.thumbColor});
  var thumbPosition = new THREE.Vector3(0, 0.30, 0.6);
  this.model = new THREE.Mesh(thumbGeometry, thumbMaterial);
  this.model.position.copy(thumbPosition);
  this.originalY = thumbPosition.y;
  this.moveAsNeeded = function(finger, newPosition, newNote) {
    var curX = this.currentPos.x;
    var delta = newPosition - curX;
    switch (finger) {
    case 5:
      this.pinkyRules(delta, curX, newNote);
      break;
    case 4:
      this.ringRules(delta,curX,newNote);
      break;
    case 3:
      this.middleRules(delta,curX,newNote);
      break;
    case 2:
      this.indexRules(delta,curX,newNote);
    }
  };

  this.pinkyRules = function(delta, curX, newNote) {
    if (delta > 0 && delta < 1.652) {
      return;
    } else if (delta > 1.652) {
      this.moveToNote(newNote - 7);
    }
    else {
      //do stuff in the other cases;
    }
  };
  this.ringRules = function(delta, curX, newNote) {
    //do stuff
    if (delta > 0 && delta < 1.28) {
      return;
    }else if (delta > 1.28) {
      this.moveToNote(newNote - 5);
    }
  };
  this.middleRules = function(delta, curX, newNote) {
    //do stuff
  };
  this.indexRules = function(delta, curX, newNote) {
    //do stuff
  };
};

module.exports.Thumb.prototype = Object.create(Finger.prototype);
module.exports.Thumb.prototype.constructor = Thumb;