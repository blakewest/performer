var helpers = require('./FingeringAlgorithmHelpers.js');

module.exports.FingeringAlgorithm = function(midiData) {
 //this whole thing is an example of Viterbi's algorithm, if you're curious.
  var RHnotes = helpers.makeRHNoteTrellis(midiData);
  var RHnotesData = helpers.makeRHnotesData(midiData);

  //traversing forward, computing costs and leaving our best path trail
  for (var layer = 1; layer < RHnotes.length; layer++) {   //go through each layer (starting at 2nd, because first is just endCap)
    for (var node1 = 0; node1 < RHnotes[layer].length ; node1++) {               //go through each node in each layer
      var min = Infinity;                 
      for (var node2 = 0; node2 < RHnotes[layer-1].length; node2++) {               //go through each node in prev layer.
        var curNode = RHnotes[layer][node1];
        var prevNode = RHnotes[layer-1][node2];
        var totalCost = prevNode.nodeScore || 0;
        for (var i = 0; i < curNode.notes.length; i++) {       //go through each note in the current Node
          var curNote = curNode.notes[i];
          var curFinger = curNode.fingers[i];
          for (var j = 0; j < prevNode.notes.length; j++) {   //add up scores for each of the previous nodes notes trying to get to current node note.
            var prevNote = prevNode.notes[j];
            var prevFinger = prevNode.fingers[j];
            var transCost = helpers.computeCost(prevNote, curNote, prevFinger, curFinger);
            totalCost += transCost;
          }
        }
        if (totalCost < min) {
          min = totalCost;
          curNode.nodeScore = totalCost;
          curNode.bestPrev = node2;
        }
      }
    }
  }

  /*Now we need to go backwards and collect the best path.
  the currentNode variable is initialized to be the lowest score of the final layer.*/
  var currentNode = helpers.findMin(RHnotes[RHnotes.length-1]);

  /*from this point, we put the finger for that node in the array, then we track back to it's
  best previous node, record it's finger, and repeat till we get to the end.
  also, we set the continuation condition to be greater than zero, because we don't actually want zero, 
  since zero is just our start object.*/
  var bestPath = [];
  for (var j = RHnotes.length-1; j > 0; j--) {
    var nodeObj = RHnotes[j][currentNode];
    var fingers = nodeObj.fingers;
    var notes = nodeObj.notes;
    for (var k = 0; k < notes.length; k++) {
      bestPath.unshift([fingers[k], notes[k]]); //use unshift, because otherwise we'd end up with a reversed fingering.
    }
    currentNode = nodeObj.bestPrev;
  }
  for (var i = 0; i < bestPath.length; i++) {
    console.log('Note: ' + bestPath[i][1] + ' / Finger: ' + bestPath[i][0]);
  }
  console.log('bestPath: ', bestPath);
  console.log('RHnotes: ', RHnotes);
};
