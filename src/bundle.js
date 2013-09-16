;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var KeyboardDesign = require('./Visuals/Piano/KeyboardDesign.js').KeyboardDesign;
var Keyboard = require('./Visuals/Piano/Keyboard.js').Keyboard;
var RightHand = require('./Visuals/Hand/RightHand.js').RightHand;
var Scene = require('./Visuals/Scene.js').Scene;

module.exports.App = function() {
  //instantiate piano and hand
  this.keyboardDesign = new KeyboardDesign();
  this.keyboard = new Keyboard(this.keyboardDesign);
  console.log(this.keyboardDesign);
  this.rightHand = new RightHand();

  //this is just here to run the function that kicks off getting the cost database;
  // createCostDatabase();

  this.player = MIDI.Player;

  //maintains proper binding if later function gets called outside this scope
  var _this = this;

  //this is the callback that fires every time the MIDI.js library 'player' object registers a MIDI event of any kind.
  this.player.addListener(function(data) {
    var rightHand = _this.rightHand;
    var NOTE_ON = 144;
    var NOTE_OFF = 128;
    var note = data.note;
    var message = data.message;
    var finger = data.finger;

    if (message === NOTE_ON) {
      _this.keyboard.press(note);
      rightHand.press(finger);
    }else if(message === NOTE_OFF) {
      _this.keyboard.release(note);
      rightHand.release(finger);
    }
  });

  this.player.setAnimation({
    delay: 20,
    callback: function(data) {
      //data has 'now' and 'end' events that may be useful for update function.
      // this.rightHand.update();
      // _this.keyboard.update();
    }
  });

  this.loadMidiFile = function(midiFile, callback) {
    var _this = this;
    //just calls loadFile from the MIDI.js library, which kicks off a few calls to parse the MIDI data.
    //we also use the callback of the loadFile function to set the MIDI data of our right hand model, so we can animate it properly.
    this.player.loadFile(midiFile, function() {
      _this.fingeringAlgorithm();
      _this.player.resume();
      // _this.rightHand.setMidiData(_this.player.data, callback);
    });
  };

  this.upload = function(file) {
    // var uploadedFile = files[0];
    var _this = this;
    console.log(file);
    var reader = new FileReader();
    reader.onload = function(e) {
      var midiFile = e.target.result;
      _this.loadMidiFile(midiFile);
    };
    reader.readAsDataURL(file);
  };

  this.initScene = function() {
    var _this = this;
    this.scene = new Scene('#canvas');
    // scene.add(this.test.sphere);
    this.scene.add(this.keyboard.model);
    this.scene.add(this.rightHand.model);
    // scene.add(this.rightHand);
    // scene.animate(function() {
    //   _this.keyboard.update();
    //   _this.rightHand.update();
    // });
    this.scene.animate(function() {
      _this.keyboard.update();
      _this.rightHand.update();
    });
  };

  this.initMIDI = function(callback) {
    console.log('theoretically initializing midi plugin');
    MIDI.loadPlugin(function() {
      MIDI.channels[9].mute = true;
    });
    if (typeof callback === 'function') {
      callback();
    }
  };

  this.start = function() {
    this.player.start();
    this.playing = true;
  };

  this.resume = function() {
    this.player.currentTime += 1e-6;
    this.player.resume();
    this.playing = true;
  };

  this.stop = function() {
    this.player.stop();
    this.playing = false;
  };

  this.pause = function() {
    this.player.pause();
    this.playing = false;
  };

  this.getEndTime = function() {
    return this.player.endTime;
  };

  this.setCurrentTIme = function(currentTime) {
    this.player.pause();
    this.player.currentTime = currentTime;
    if (this.playing) {
      this.player.resume();
    }
  };

  this.fingeringAlgorithm = function() {
    var midiData = _this.player.data;
    var notes = {
      0: 'C',
      1: 'Db',
      2: 'D',
      3: 'Eb',
      4: 'E',
      5: 'F',
      6: 'Gb',
      7: 'G',
      8: 'Ab',
      9: 'A',
      10: 'Bb',
      11: 'B'
    };
    var RHnotes = [];
    var LHnotes = [];
    // ["E", "E", "E", "E", "F", "G", "F", "G", "G", "F", "G", "E", "F", "D", "E", "C", "D", "C", "C", "D", "C", "E", "D", "E", "E", "D", "E", "D", "D", "E", "D", "E", "E", "F",
    //  "E", "G", "F", "G", "G", "F", "G", "E", "F", "D", "E", "C", "D", "C", "C", "D", "C", "E", "D", "D", "E", "C", "D", "C", "C", "C"]

    // ["E", "E", "E", "E", "F", "G", "F", "G", "G", "F", "G", "E", "F", "D", "E", "C", "D", "C", "C", "D", "C", "E", "D", "E", "E", "D", "E", "D", "D", "E", "D", "E", "E", "F", 
    //  "E", "G", "F", "G", "G", "F", "G", "E", "F", "D", "E", "C", "D", "C", "C", "D", "C", "E", "D", "D", "E", "C", "D", "C", "C", "C"]

    var fakeFingeringData = [
      3,3,3,3,4,5,4,5,5,4,5,3,4,2,3,1,2,1,1,2,1,3,2,3,3,2,3,2,2,3,2,3,3,4,3,5,4,5,5,4,5,3,4,2,3,1,2,1,1,2,1,3,2,2,3,1,2,1,1,1
    ];
    var counter = 0;
    for (var pair = 0; pair < midiData.length; pair++) {
      var eventData = midiData[pair][0].event;
      // eventData.subtype === 'noteOn' || eventData.subtype === 'noteOff' && 
      if (eventData.noteNumber >= 60) {
        var note = notes[eventData.noteNumber%12];
        RHnotes.push(note);
        if (eventData.subtype === 'noteOn' || eventData.subtype === 'noteOff') {
          eventData.finger = fakeFingeringData[counter];
          counter++;
        }


        // if (eventData.noteNumber >= 60) {
        //   RHnotes.push(note);
        // }else {
        //   // LHnotes.push(note);
        // }
      }
      // if (eventData.subtype === 'noteOff') {
      //   eventData.finger = 0;
      // }
    }

    console.log(midiData);
    console.log('Right Hand: ', RHnotes);
    console.log('Left Hand: ', LHnotes);
  };

};




































},{"./Visuals/Hand/RightHand.js":8,"./Visuals/Piano/Keyboard.js":11,"./Visuals/Piano/KeyboardDesign.js":12,"./Visuals/Scene.js":14}],2:[function(require,module,exports){
var App = require('./App.js').App;
$(document).on('ready', function() {
  var app = window.app = new App(); //maybe put the whole app in a name space(like b), then if you need to refer to it, you can  refer to app as b.app
  app.initScene();
  app.initMIDI();
});

var sendToUpload = function(file) {
  app.upload(file);
};


},{"./App.js":1}],3:[function(require,module,exports){
module.exports.Finger = function() {
  var pressAmount = 0.08; 
  this.originalY = 0.2; // this is just a default. each finger will actually overwrite this as necessary.
  this.pressedY = this.originalY - pressAmount;
  this.releaseSpeed = 0.03;

  this.press = function() {
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
},{}],4:[function(require,module,exports){
module.exports.HandDesign = function() {
  //pinky specs
  this.pinkyWidth = 0.185;
  this.pinkyHeight = 0.1;
  this.pinkyLength = 0.57;
  this.pinkyColor = 0xFF0000;

  //ring finger specs
  this.ringFingerWidth = 0.185;
  this.ringFingerHeight = 0.1;
  this.ringFingerLength = 0.61;
  this.ringFingerColor = 0x006600;

  //middle finger specs
  this.middleFingerWidth = 0.185;
  this.middleFingerHeight = 0.1;
  this.middleFingerLength = 0.7;
  this.middleFingerColor = 0x0033FF;

  //index finger specs
  this.indexFingerWidth = 0.185;
  this.indexFingerHeight = 0.1;
  this.indexFingerLength = 0.60;
  this.indexFingerColor = 0xFFFF00;

  //thumb specs
  this.thumbWidth = 0.185;
  this.thumbHeight = 0.1;
  this.thumbLength = 0.5;
  this.thumbColor = 0xFF33FF;

  this.keyboardHeight = 0.22;
};
},{}],5:[function(require,module,exports){
var Finger = require('./Finger.js').Finger;

var IndexFinger = module.exports.IndexFinger = function(handInfo) {
  Finger.call(this);
  var indexFingerGeometry = new THREE.CubeGeometry(handInfo.indexFingerWidth, handInfo.indexFingerHeight, handInfo.indexFingerLength);
  var indexFingerMaterial = new THREE.MeshLambertMaterial({color: handInfo.indexFingerColor});
  var indexFingerPosition = new THREE.Vector3(8.496, 0.20, 0.45); // this first value is just hardcoded to put the finger directly on top of a note.
  this.model = new THREE.Mesh(indexFingerGeometry, indexFingerMaterial);
  this.model.position.copy(indexFingerPosition);
  this.originalY = indexFingerPosition.y;
};

IndexFinger.prototype = Object.create(Finger.prototype);
IndexFinger.prototype.constructor = IndexFinger;
},{"./Finger.js":3}],6:[function(require,module,exports){
var Finger = require('./Finger.js').Finger;

var MiddleFinger = module.exports.MiddleFinger = function(handInfo) {
  Finger.call(this);
  var middleFingerGeometry = new THREE.CubeGeometry(handInfo.middleFingerWidth, handInfo.middleFingerHeight, handInfo.middleFingerLength);
  var middleFingerMaterial = new THREE.MeshLambertMaterial({color: handInfo.middleFingerColor});
  var middleFingerPosition = new THREE.Vector3(8.732, 0.20, 0.4); // this first value is just hardcoded to put the finger directly on top of a note.
  this.model = new THREE.Mesh(middleFingerGeometry, middleFingerMaterial);
  this.model.position.copy(middleFingerPosition);
  this.originalY = middleFingerPosition.y;
};

MiddleFinger.prototype = Object.create(Finger.prototype);
MiddleFinger.prototype.constructor = MiddleFinger;
},{"./Finger.js":3}],7:[function(require,module,exports){
var Finger = require('./Finger.js').Finger;

var Pinky = module.exports.Pinky = function(handInfo) {
  Finger.call(this);
  var pinkyGeometry = new THREE.CubeGeometry(handInfo.pinkyWidth, handInfo.pinkyHeight, handInfo.pinkyLength);
  var pinkyMaterial = new THREE.MeshLambertMaterial({color: handInfo.pinkyColor})
  var pinkyPosition = new THREE.Vector3(9.204, 0.20, 0.54);
  this.model = new THREE.Mesh(pinkyGeometry, pinkyMaterial);
  this.model.position.copy(pinkyPosition);
  this.originalY = pinkyPosition.y;
};

Pinky.prototype = Object.create(Finger.prototype);
Pinky.prototype.constructor = Pinky;

},{"./Finger.js":3}],8:[function(require,module,exports){
var Pinky = require('./Pinky.js').Pinky;
var RingFinger = require('./RingFinger.js').RingFinger;
var MiddleFinger = require('./MiddleFinger.js').MiddleFinger;
var IndexFinger = require('./IndexFinger.js').IndexFinger;
var Thumb = require('./Thumb.js').Thumb;
var HandDesign = require('./HandDesign.js').HandDesign;

module.exports.RightHand = function() {
  var _this = this;
  var handDesign = new HandDesign();
  var ringFinger = new RingFinger(handDesign);
  var pinky = new Pinky(handDesign);
  var middleFinger = new MiddleFinger(handDesign);
  var indexFinger = new IndexFinger(handDesign);
  var thumb = new Thumb(handDesign);

  this.fingers = [];
  this.model = new THREE.Object3D();

  //add fingers to hand model
  this.fingers.push(undefined); // this is just here to make the off by 1 error go away. (We want finger 1 to be thumb so that semantically it makes sense)

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
    console.log('the ' + finger + ' finger is trying to press');
    _this.fingers[finger].press();
  };

  this.release = function(finger) {
    console.log('the ' + finger + ' finger is trying to release');
    _this.fingers[finger].release();
  };

  this.update = function() {
    var fingers = _this.fingers;
    for (var i = 1; i < fingers.length; i++) {
      fingers[i].update();
    }
  };

};
},{"./HandDesign.js":4,"./IndexFinger.js":5,"./MiddleFinger.js":6,"./Pinky.js":7,"./RingFinger.js":9,"./Thumb.js":10}],9:[function(require,module,exports){
var Finger = require('./Finger.js').Finger;

var RingFinger = module.exports.RingFinger = function(handInfo) {
  Finger.call(this);
  var ringFingerGeometry = new THREE.CubeGeometry(handInfo.ringFingerWidth, handInfo.ringFingerHeight, handInfo.ringFingerLength);
  var ringFingerMaterial = new THREE.MeshLambertMaterial({color: handInfo.ringFingerColor});
  var ringFingerPosition = new THREE.Vector3(8.968, 0.20, 0.45); // this first value is just hardcoded to put the finger directly on top of a note.
  this.model = new THREE.Mesh(ringFingerGeometry, ringFingerMaterial);
  this.model.position.copy(ringFingerPosition);
  this.originalY = ringFingerPosition.y;
};

RingFinger.prototype = Object.create(Finger.prototype);
RingFinger.prototype.constructor = RingFinger;
},{"./Finger.js":3}],10:[function(require,module,exports){
var Finger = require('./Finger.js').Finger;

var Thumb = module.exports.Thumb = function(handInfo) {
  Finger.call(this);
  var thumbGeometry = new THREE.CubeGeometry(handInfo.thumbWidth, handInfo.thumbHeight, handInfo.thumbLength);
  var thumbMaterial = new THREE.MeshLambertMaterial({color: handInfo.thumbColor});
  var thumbPosition = new THREE.Vector3(8.260, 0.20, 0.6); // this first value is just hardcoded to put the finger directly on top of a note.
  this.model = new THREE.Mesh(thumbGeometry, thumbMaterial);
  this.model.position.copy(thumbPosition);
  this.originalY = thumbPosition.y;
};

module.exports.Thumb.prototype = Object.create(Finger.prototype);
module.exports.Thumb.prototype.constructor = Thumb;
},{"./Finger.js":3}],11:[function(require,module,exports){
var PianoKey = require("./PianoKey.js").PianoKey;

module.exports.Keyboard = function(keyboardDesign) {
  //keyboard design is a completed object where we've filled it out with note types and parameters. See keyboardDesign.js file for more.
  this.model = new THREE.Object3D();
  this.keys = [];
  var _this = this;

  //build the actual keyboard
  for (var note = 0; note < keyboardDesign.keyInfo.length; note++) {
    var key = new PianoKey(keyboardDesign, note);
    _this.keys.push(key);
    if (note > 20 && note < 109) {
      this.model.add(key.model);
    }
  }
  this.model.y -= keyboardDesign.whiteKeyHeight / 2;

  this.press = function(note) {
    _this.keys[note].press();
  };

  this.release = function(note) {
    _this.keys[note].release();
  };

  this.update = function() {
    var _this = this;
    var allKeys = _this.keys;
    for (var i = 0; i < allKeys.length; i++) {
      allKeys[i].update();
    }
  };
};
},{"./PianoKey.js":13}],12:[function(require,module,exports){
module.exports.KeyboardDesign = function() {
  this.KeyType = {
    WhiteC:  0,
    WhiteD: 1,
    WhiteE:  2,
    WhiteF:  3,
    WhiteG: 4,
    WhiteA: 5,
    WhiteB: 6,
    Black:   7
  };

  this.whiteKeyStep                  = 0.236;
  this.whiteKeyWidth                = 0.226;
  this.whiteKeyHeight               = 0.22;
  this.whiteKeyLength               = 1.50;
  this.blackKeyWidth                 =0.10;
  this.blackKeyHeight               = 0.24;
  this.blackKeyLength               = 1.00;
  this.blackKeyShiftCDE            = 0.0216;
  this.blackKeyShiftFGAB           = 0.0340;
  this.blackKeyPosY                   = 0.10;
  this.blackKeyPosZ                   = -0.24;
  this.noteDropPosZ4WhiteKey  = 0.25;
  this.noteDropPosZ4BlackKey  = 0.75;
  this.whiteKeyColor                  = 0xffffff;
  this.blackKeyColor                  = 0x111111;
  this.keyDip                             = 0.08;
  this.keyUpSpeed                     = 0.03;
  this.keyInfo                            = [] ;// an array holding each key's type and position

  var _this = this;
  //essentially an initialization function
  var createBoardInfo = function() {
    makeNoteObjects();
    initKeyType();
    initKeyPos();
  };

  var makeNoteObjects = function() {
    for (var i = 0; i < 120; i++) {
      var noteObj = {};
      _this.keyInfo.push(noteObj);
    }
  };

  var initKeyType = function() {
    var KeyType = _this.KeyType;
    var keyInfo = _this.keyInfo;
    for (var i = 0; i< 10; i++) {
      var noteNo = 12*i;
      keyInfo[noteNo + 0].keyType = KeyType.WhiteC;
      keyInfo[noteNo + 1].keyType = KeyType.Black;
      keyInfo[noteNo + 2].keyType = KeyType.WhiteD;
      keyInfo[noteNo + 3].keyType = KeyType.Black;
      keyInfo[noteNo + 4].keyType = KeyType.WhiteE;
      keyInfo[noteNo + 5].keyType = KeyType.WhiteF;
      keyInfo[noteNo + 6].keyType = KeyType.Black;
      keyInfo[noteNo + 7].keyType = KeyType.WhiteG;
      keyInfo[noteNo + 8].keyType = KeyType.Black;
      keyInfo[noteNo + 9].keyType = KeyType.WhiteA;
      keyInfo[noteNo + 10].keyType = KeyType.Black;
      keyInfo[noteNo + 11].keyType = KeyType.WhiteD;
    }
  };

  var initKeyPos = function() {
    //setting up convenience vars
    var keyInfo         = _this.keyInfo;
    var KeyType        = _this.KeyType;
    var prevKeyType = KeyType.WhiteB;
    var noteNo         = 0;
    var posX             = 0.0;
    var shift             = 0.0;
    var Black            = KeyType.Black;

    //setting position of first note;
    keyInfo[noteNo].keyCenterPosX = posX;
    prevKeyType = keyInfo[noteNo].keyType;

    //set position of all the rest of the notes.

    for ( noteNo = 1; noteNo< keyInfo.length; noteNo++) {
      if (prevKeyType === Black) {
        posX += _this.whiteKeyStep / 2.0;
      }else {
        if (keyInfo[noteNo].keyType === Black) {
          posX += _this.whiteKeyStep / 2.0;
        }else {
          posX += _this.whiteKeyStep;
        }
      }
      keyInfo[noteNo].keyCenterPosX = posX;
      prevKeyType = keyInfo[noteNo].keyType;
    }

  };

  //calling initialization function
  createBoardInfo();
};





























},{}],13:[function(require,module,exports){
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
    material   = new THREE.MeshPhongMaterial(boardInfo.blackKeyColor);
    position   = new THREE.Vector3(keyCenterPosX, boardInfo.blackKeyPosY, boardInfo.blackKeyPosZ);
  }else {
    geometry = new THREE.CubeGeometry(boardInfo.whiteKeyWidth, boardInfo.whiteKeyHeight, boardInfo.whiteKeyLength);
    material   = new THREE.MeshPhongMaterial( {color: boardInfo.whiteKeyColor, emissive: 0x111111} );
    position   = new THREE.Vector3(keyCenterPosX, boardInfo.whiteKeyPosY, boardInfo.whiteKeyPosZ);
  }

  //make the key Mesh
  this.model = new THREE.Mesh(geometry, material);
  this.model.position.copy(position);

  //set helper properties
  this.keyUpSpeed = boardInfo.keyUpSpeed;
  this.originalY = position.y;
  this.pressedY = this.originalY - boardInfo.keyDip;
};

PianoKey.prototype.press = function() {
  this.model.position.y = this.pressedY;
  this.isPressed = true;
};

PianoKey.prototype.release = function() {
  this.isPressed = false;
};

PianoKey.prototype.update = function() {
  //this is really about making released notes edge up slowly, rather than quickly
  if (this.model.position.y < this.originalY && this.isPressed === false) {
    //offset will keep getting smaller as the model's position gets raised by keyUpSpeed because update runs 60 times/second.
    var offset = this.originalY - this.model.position.y;
    this.model.position.y += Math.min(offset, this.keyUpSpeed);
  }
};
},{}],14:[function(require,module,exports){
module.exports.Scene = function(container) {
  var $container = $(container);
  var width = $container.width();
  var height = $container.height();
  var _this = this;

  //create scene
  var scene = new THREE.Scene();

  //create camera
  var view_angle = 90;
  var aspect = width/height;
  var near = 0.001;
  var far = 100000;
  var camera = new THREE.PerspectiveCamera(view_angle, aspect, near, far);
  // camera.lookAt(new THREE.Vector3());
  camera.position.set(7, 7, 6);
  camera.rotation.y = 0 * Math.PI / 180;
  camera.rotation.x = -30 * Math.PI / 180;
  // camera.rotation.z = 0 * Math.PI / 180;




  //create and append renderer
  var renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 1);
  renderer.autoClear = false;
  $container.append(renderer.domElement);

  //create lights
  var ambientLight = new THREE.AmbientLight(0x222222);

  var mainLight = new THREE.DirectionalLight(0xffffff, 0.8)
  mainLight.position.set(1,2,4).normalize();

  var auxLight = new THREE.DirectionalLight(0xffffff, 0.3);
  auxLight.position.set(-4,-1,-2).normalize;

  //add everything to the scene
  scene.add(ambientLight);
  scene.add(mainLight);
  scene.add(auxLight);
  scene.add(camera);

  //set props for return object
  this.camera =   camera;
  this.renderer = renderer;
  this.scene =     scene;

  this.add = function(object) {
    scene.add(object);
  };
  this.animate = function(callback) {
    requestAnimationFrame(function() {
      _this.animate(callback);
    });
    if ( typeof callback === 'function') {
      callback();
    }
    _this.renderer.render(_this.scene, _this.camera);
  };
};
},{}]},{},[2])
;