var costDb = require('./CostAlgorithm.js').createCostDatabase();
var mod = module.exports;

mod.notes = {0:'C', 1:'C#', 2:'D', 3:'Eb', 4:'E', 5:'F', 6:'F#', 7:'G', 8:'G#', 9:'A', 10:'Bb', 11:'B'};

var fingerOptions = {
  1: [[1], [2], [3], [4], [5]],
  2: [[1,2], [1,3], [1,4], [1,5], [2,3], [2,4], [2,5], [3,4], [3,5], [4,5]],
  3: [[1,2,3], [1,2,4], [1,2,5], [1,3,4], [1,3,5], [1,4,5], [2,3,4], [2,3,5], [2,4,5], [3,4,5]],
  4: [[1,2,3,4], [1,2,3,5], [1,2,4,5], [1,3,4,5], [2,3,4,5]],
  5: [[1,2,3,4,5]]
};

var endCap = [
  {note: 'endCap'},
  {note: 'endCap'},
  {note: 'endCap'},
  {note: 'endCap'},
  {note: 'endCap'},
];

var makeNoteNode = function(notes, fingers) {
  //the notes and fingers property can have either one or multiple notes. 
  this.notes = notes;     //this is an array of notes
  this.fingers = fingers; // this is an array of finger options. 
  this.nodeScore = 0;
  this.bestPrev = undefined;
};

var makeLayer = function(notes) {
  var sortedNotes = notes.sort(function(a,b) {return a-b});
  var layer = [];
  var options = fingerOptions[sortedNotes.length]; // this grabs the appropriate list of options. 
  for (var i = 0; i < options.length; i++) {
    var fingerChoice = options[i];
    var node = new makeNoteNode(sortedNotes, fingerChoice);
    layer.push(node);
  }
  return layer;
};

mod.makeRHNoteTrellis = function(midiData) {
  //i'll need a 'currentlyPlaying' array, a 'newLayer' array, and a 'lastwasOn' variable that tracks if the last event was a noteOn or noteOff
  //noteOn event comes in, put the note in currentlyPlaying
  //noteOff event comes in... 
  // if 'lastWasOn' is true, then place all currentlyPlaying into newLayer, and remove the noteOff from currentlyPlaying
  // if 'lastWasOn' is false, then remove that note from currentlyPlaying, and don't push anything to newLayer.
  var curPlaying = [];
  var lastWasOn = false;
  var trellis = [];

  for (var pair = 0; pair < midiData.length; pair++) {
    var eventData = midiData[pair][0].event;
    var note = eventData.noteNumber;
    var newLayer, notePlace;
    if (note >= 60 && eventData.subtype === 'noteOn') {
      curPlaying.push(note);
      lastWasOn = true;
    }
    if (note >= 60 && eventData.subtype === 'noteOff') {
      if (lastWasOn) {
        // debugger;
        newLayer = makeLayer(curPlaying);
        trellis.push(newLayer);
        notePlace = curPlaying.indexOf(note);
        curPlaying.splice(notePlace, 1);
        lastWasOn = false;
      }else {
        notePlace = curPlaying.indexOf(note);
        curPlaying.splice(notePlace, 1);
        lastWasOn = false;
      }
    }
  }
  // debugger;
  return trellis;
};

mod.makeRHnotesData = function(midiData) {
  var noteData = [];
  for (var pair = 0; pair < midiData.length; pair++) {
    var eventData = midiData[pair][0].event;
    if (eventData.noteNumber >= 60 && eventData.subtype === 'noteOn') {
      noteData.push(midiData[pair]);
    }
  }
  return noteData;
}

mod.computeCost = function(n1,n2,f1,f2) {
  if (n1 === 'endCap' || n2 === 'endCap') {
    return 0;
  }
  var key = n1 + ',' + n2 + ',' + f1 + ',' + f2;
  return costDb[key];
};

mod.findMin = function(layer) {
  var minNode;
  var minScore = Infinity;
  for (var node = 0; node < layer.length; node++) {
    if (layer[node].nodeScore < minScore) {
      minScore = layer[node].nodeScore;
      minNode = node;
    }
  }
  return minNode;
};