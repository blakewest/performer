var costDb = require('./CostAlgorithm.js').createCostDatabase();
var curBest = Infinity;
var endCap = [
  {note: 'endCap'},
  {note: 'endCap'},
  {note: 'endCap'},
  {note: 'endCap'},
  {note: 'endCap'},
];

var Notes = {
  0: 'C',
  1: 'C#',
  2: 'D',
  3: 'Eb',
  4: 'E',
  5: 'F',
  6: 'F#',
  7: 'G',
  8: 'G#',
  9: 'A',
  10: 'Bb',
  11: 'B'
};

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

var makeRHNoteTrellis = function(midiData) {
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

var computeCost = function(n1,n2,f1,f2) {
  if (n1 === 'endCap' || n2 === 'endCap') {
    return 0;
  }
  var key = n1 + ',' + n2 + ',' + f1 + ',' + f2;
  return costDb[key];
};

var findMin = function(layer) {
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

module.exports.FingeringAlgorithm = function(midiData) {
   //this whole thing is an example of Viterbi's algorithm, if you're curious.
    var RHnotes = makeRHNoteTrellis(midiData);

    //traversing forward, computing costs and leaving our best path trail
    for (var layer = 1; layer < RHnotes.length; layer++) {
      for (var node1 = 0; node1 < 5 ; node1++) {
        var min = Infinity;
        for (var node2 = 0; node2 < 5; node2++) {
          var curNode = RHnotes[layer][node1];
          var prevNode = RHnotes[layer-1][node2];
          var transCost = computeCost(prevNode.note, curNode.note, prevNode.finger, curNode.finger);
          var totalCost = transCost + prevNode.nodeScore;
          if (totalCost < min) {
            min = totalCost;
            curNode.nodeScore = totalCost;
            curNode.bestPrev = node2;
          }
        }
      }
    }

    /*going backwards, collecting the best path along the way.
    the curNode variable is initialized to be the lowest score of the final layer.*/
    var currentNode = findMin(RHnotes[RHnotes.length-1]);
    var bestPath = [];
    /*from this point, we put the finger for that node in the array, then we track back to it's
    best previous node, record it's finger, and repeat till we get to the end.
    also, we set the continuation condition to be greater than zero, because we don't actually want zero, 
    since zero is just our start object.*/
    for (var j = RHnotes.length-1; j > 0; j--) {
      var nodeObj = RHnotes[j][currentNode];
      var curFinger = nodeObj.finger;
      var note = Notes[(nodeObj.note)%12];
      bestPath.push([curFinger, note]);
      currentNode = nodeObj.bestPrev;
    }
    bestPath.reverse();
    for (var i = 0; i < bestPath.length; i++) {
      console.log('Note: ' + bestPath[i][1] + ' / Finger: ' + bestPath[i][0]);
    }

    console.log(midiData);
};
