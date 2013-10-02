var KeyboardDesign = require('./Visuals/Piano/KeyboardDesign.js').KeyboardDesign;
var Keyboard = require('./Visuals/Piano/Keyboard.js').Keyboard;
var RightHand = require('./Visuals/Hands/Right/RightHand.js').RightHand;
var LeftHand = require('./Visuals/Hands/Left/LeftHand.js').LeftHand;
var Scene = require('./Visuals/Scene.js').Scene;
var createDb = require('./Algorithms/CostAlgorithm').createCostDatabase;
var fingeringAlgo = require('./Algorithms/FingeringAlgorithm.js').FingeringAlgorithm;
var PlayControls = require('./PlayControls.js').PlayControls;

module.exports.App = function() {
  //instantiate piano and hand
  this.keyboardDesign = new KeyboardDesign();
  this.keyboard = new Keyboard(this.keyboardDesign);
  this.rightHand = new RightHand(this.keyboard);
  this.leftHand = new LeftHand(this.keyboard);
  this.player = MIDI.Player

  //maintains proper binding if later function gets called outside this scope
  var _this = this;

  //this is the callback that fires every time the MIDI.js library 'player' object registers a MIDI event of any kind.
  this.player.addListener(function(data) {
    var rightHand = _this.rightHand
    var leftHand = _this.leftHand;
    var NOTE_ON = 144
    var NOTE_OFF = 128;
    var note = data.note;
    var message = data.message;
    var finger = data.finger;

    if (message === NOTE_ON) {
      _this.keyboard.press(note);
      finger > 0 ? rightHand.press(finger, note) : leftHand.press(finger, note);
    }else if(message === NOTE_OFF) {
      _this.keyboard.release(note);
      finger > 0 ? rightHand.release(finger) : leftHand.release(finger);
    }
  });

  this.player.setAnimation({
    delay: 20,
    callback: function(data) {
      var current = data.now;
      var total = data.end;
      _this.playControls.displayProgress(current, total);
    }
  });

  this.loadMidiFile = function(midiFile, newStartPercent) {
    var _this = this;
    //just calls loadFile from the MIDI.js library, which kicks off a few calls to parse the MIDI data.
    this.player.loadFile(midiFile, function() {
      _this.playControls.setCurrentTIme(newStartPercent);
    });
  };

  this.upload = function(file) {
    // var uploadedFile = files[0];
    var _this = this;
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
    this.scene.add(this.keyboard.model);
    this.scene.add(this.rightHand.model);
    this.scene.add(this.leftHand.model);
    // scene.animate(function() {
    //   _this.keyboard.update();
    //   _this.rightHand.update();
    // });
    this.scene.animate(function() {
      _this.keyboard.update();
      _this.rightHand.update();
      _this.leftHand.update();
      TWEEN.update();
    });
  };

  this.initMIDI = function(callback) {
    MIDI.loadPlugin(function() {
      MIDI.channels[9].mute = true;
      if (typeof callback === 'function') {
        callback();
      }
    });
  
  };

  this.initPlayControls = function(container, app) {
    _this.playControls = new PlayControls(container, app);
  };

  this.fingeringAlgorithm = function() {
    fingeringAlgo(_this.player.data);
  };
};



































