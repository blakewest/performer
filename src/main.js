var fingeringAlgorithm = function(midiData) {
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

var IO = function(file) {
  // var uploadedFile = files[0];
  console.log(file);
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function(e) {
    var midiFile = e.target.result;
    MIDI.Player.loadFile(midiFile);
    var midiObj = MIDI.Player.data;
    console.log('MIDI Object = ', midiObj);
    fingeringAlgorithm(midiObj);
  };
};

// var IO = function(_fileElement, _callback){
//   if (!window.File || !window.FileReader){              // check browser compatibillity
//     if (this.debug) console.log('The File APIs are not fully supported in this browser.');
//     return false;
//   }
//   document.getElementById(_fileElement).onchange = (function(_t){   // set the file open event handler
//     return function(InputEvt){
//       if (!InputEvt.target.files.length) return false;
//       var reader = new FileReader();                // prepare the file Reader
//       reader.readAsArrayBuffer(InputEvt.target.files[0]);     // read the binary data
//       reader.onload = (function(_t) {               // when ready...
//         return function(e){
//           _callback( _t.loadFile(e.target.result)); // encode data with Uint8Array and call the parser
//         };
//       })(_t);
//     };
//   })(this);
// };