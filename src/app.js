var App = function() {
  //instantiate piano and hand
  this.keyboardDesign = new KeyboardDesign();
  this.handDesign = new HandDesign();
  this.pinky = new Pinky(this.handDesign);
  this.ringFinger = new RingFinger(this.handDesign);
  this.middleFinger = new MiddleFinger(this.handDesign);
  this.indexFinger = new IndexFinger(this.handDesign);
  this.thumb = new Thumb(this.handDesign);
  this.keyboard = new Keyboard(this.keyboardDesign);
  console.log(this.keyboardDesign);
  this.rightHand = new RightHand(this.pinky, this.ringFinger, this.middleFinger, this.indexFinger, this.thumb);

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



































