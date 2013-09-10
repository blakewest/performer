var fingeringAlgorithm = function(midiData) {
  console.log(midiData);
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
  var notesArray = midiData.track[0].event;
  var justNotes = [];
  var RHnotes = [];
  var LHnotes = [];
  for (var i = 0; i < notesArray.length; i++) {
    if (notesArray[i].type === 9 && notesArray[i].data[1] !== 0) {
      justNotes.push(notesArray[i].data);
    }
  }
  for (var j = 0; j < justNotes.length; j++) {
    if (justNotes[j][0] >= 60) {
      RHnotes.push(notes[(justNotes[j][0]%12)]);
    }else {
      LHnotes.push(notes[(justNotes[j][0]%12)]);  
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