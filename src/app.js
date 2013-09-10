var App = function() {
  //instantiate piano and hand
  this.keyboardDesign = new KeyboardDesign;
  this.keyboard = new Keyboard(this.keyboardDesign);
  this.rightHand = new RightHand();

  this.player = MIDI.player;

  //maintains proper binding if later function gets called outside this scope
  var _this = this;

  //this is the callback that fires every time the MIDI.js library 'player' object registers a MIDI event of any kind.
  this.player.addListener(function(data) {
    var NOTE_ON = 144;
    var NOTE_OFF = 128;
    var note = data.note;
    var message = data.message;
    if (message === NOTE_ON) {
      _this.keyboard.press(note);
    }else if(message === NOTE_OFF) {
      _this.keyboard.release(note);
    }
  });

  this.player.setAnimation({
    delay: 20,
    callback: function(data) {
      //data has 'now' and 'end' events that may be useful for update function.
      this.rightHand.update();
    }
  });
};

App.prototype.initScene = function() {
  var _this = this;
  var scene = new Scene('#canvas');
  scene.add(this.keyboard);
  scene.add(this.rightHand);
  scene.animate(function() {
    _this.keyboard.update();
    _this.rightHand.update();
  });
}

App.prototype.loadMidiFile = function(midiFile, callback) {
  var _this = this;
  //just calls loadFile from the MIDI.js library, which kicks off a few calls to parse the MIDI data.
  //we also use the callback of the loadFile function to set the MIDI data of our right hand model, so we can animate it properly.
  _this.player.loadFile(midiFile, function() {
    _this.rightHand.setMidiData(_this.player.data, callback);
  });
};

App.prototype.start = function() {
  this.player.start();
  this.playing = true;
};

App.prototype.resume = function() {
  this.player.currentTime += 1e-6;
  this.player.resume();
  this.playing = true;
};

App.prototype.stop = function() {
  this.player.stop();
  this.playing = false;
};

App.prototype.pause = function() {
  this.player.pause();
  this.playing = false;
};

App.prototype.getEndTime = function() {
  return this.player.endTime;
};

App.prototype.setCurrentTIme = function(currentTime) {
  this.player.pause();
  this.player.currentTime = currentTime;
  if (this.playing) {
    this.player.resume();
  }
};






























