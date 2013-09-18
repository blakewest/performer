var KeyboardDesign = require('./Visuals/Piano/KeyboardDesign.js').KeyboardDesign;
var Keyboard = require('./Visuals/Piano/Keyboard.js').Keyboard;
var RightHand = require('./Visuals/Hand/RightHand.js').RightHand;
var Scene = require('./Visuals/Scene.js').Scene;
var createDb = require('./Algorithms/CostAlgorithm').createCostDatabase;
var fingeringAlgo = require('./Algorithms/FingeringAlgorithm.js').FingeringAlgorithm;

module.exports.App = function() {
  //instantiate piano and hand
  this.keyboardDesign = new KeyboardDesign();
  this.keyboard = new Keyboard(this.keyboardDesign);
  this.rightHand = new RightHand();

  this.player = MIDI.Player;

  //maintains proper binding if later function gets called outside this scope
  var _this = this;

  //this is the callback that fires every time the MIDI.js library 'player' object registers a MIDI event of any kind.
  // this.player.addListener(function(data) {
  //   var rightHand = _this.rightHand;
  //   var NOTE_ON = 144;
  //   var NOTE_OFF = 128;
  //   var note = data.note;
  //   var message = data.message;
  //   var finger = data.finger;

  //   if (message === NOTE_ON) {
  //     _this.keyboard.press(note);
  //     rightHand.press(finger);
  //   }else if(message === NOTE_OFF) {
  //     _this.keyboard.release(note);
  //     rightHand.release(finger);
  //   }
  // });

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
    fingeringAlgo(_this.player.data);
  };
};



































