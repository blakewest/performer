var App = function() {
  //instantiate piano and hand
  this.keyboardDesign = new KeyboardDesign;
  this.keyboard = new Keyboard(this.keyboardDesign);
  // this.rightHand = new RightHand();
  this.test = new Test();

  this.player = MIDI.Player;
  console.log(this.player);

  //maintains proper binding if later function gets called outside this scope
  var _this = this;

  //this is the callback that fires every time the MIDI.js library 'player' object registers a MIDI event of any kind.
  // this.player.addListener(function(data) {
  //   var NOTE_ON = 144;
  //   var NOTE_OFF = 128;
  //   var note = data.note;
  //   var message = data.message;
  //   if (message === NOTE_ON) {
  //     _this.keyboard.press(note);
  //   }else if(message === NOTE_OFF) {
  //     _this.keyboard.release(note);
  //   }
  // });

  // this.player.setAnimation({
  //   delay: 20,
  //   callback: function(data) {
  //     //data has 'now' and 'end' events that may be useful for update function.
  //     this.rightHand.update();
  //   }
  // });

  this.loadMidiFile = function(midiFile, callback) {
    var _this = this;
    //just calls loadFile from the MIDI.js library, which kicks off a few calls to parse the MIDI data.
    //we also use the callback of the loadFile function to set the MIDI data of our right hand model, so we can animate it properly.
    this.player.loadFile(midiFile, function() {
      _this.fingeringAlgorithm(_this.player.data);
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
    var scene = new Scene('#canvas');
    // scene.add(this.test.sphere);
    scene.add(this.keyboard.model);
    // scene.add(this.rightHand);
    // scene.animate(function() {
    //   _this.keyboard.update();
    //   _this.rightHand.update();
    // });
    scene.animate();
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

  this.fingeringAlgorithm = function(midiData) {
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

    for (var pair = 0; pair < midiData.length; pair++) {
      var eventData = midiData[pair][0].event;
      if (eventData.subtype === 'noteOn') {
        var note = notes[eventData.noteNumber%12];
        if (eventData.noteNumber >= 62) {
          RHnotes.push(note);
        }else {
          LHnotes.push(note);
        }
      }
    }

    console.log('Right Hand: ', RHnotes);
    console.log('Left Hand: ', LHnotes);
  };

};



































