var costDb = require('./CostAlgorithm.js').createCostDatabase();
var mod = module.exports;

mod.notes = {0: 'C', 1: 'C#',2: 'D',3: 'Eb',4: 'E',5: 'F',6: 'F#',7: 'G',8: 'G#',9: 'A',10: 'Bb',11: 'B'};

var endCap = [
  {note: 'endCap'},
  {note: 'endCap'},
  {note: 'endCap'},
  {note: 'endCap'},
  {note: 'endCap'},
];

var makeNoteNode = function(noteNumber, fingerNumber) {
  this.note = noteNumber;
  this.finger = fingerNumber;
  this.nodeScore = 0;
  this.bestPrev = undefined;
};

var makeLayer = function(noteNumber) {
  var layer = [];
  for (var finger = 1; finger <= 5; finger++) {
    var node = new makeNoteNode(noteNumber, finger);
    layer.push(node);
  }
  return layer;
};

mod.makeRHNoteTrellis = function(midiData) {
  var trellis = [];
  //putting the endCap at the beginning is a convenience so we don't have to have special conditions in the traversal loop.
  trellis.push(endCap);
  for (var pair = 0; pair < midiData.length; pair++) {
    var eventData = midiData[pair][0].event;
    var note = eventData.noteNumber;
    if (eventData.noteNumber >= 60 && eventData.subtype === 'noteOn') {
      var layer = makeLayer(note);
      trellis.push(layer);
    }
  }
  return trellis;
};

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