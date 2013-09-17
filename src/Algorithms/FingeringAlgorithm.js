var helpers = require('./FingeringAlgorithmHelpers.js');

module.exports.FingeringAlgorithm = function(midiData) {
 //this whole thing is an example of Viterbi's algorithm, if you're curious.
  var RHnotes = helpers.makeRHNoteTrellis(midiData);

  //traversing forward, computing costs and leaving our best path trail
  for (var layer = 1; layer < RHnotes.length; layer++) {
    for (var node1 = 0; node1 < 5 ; node1++) {
      var min = Infinity;
      for (var node2 = 0; node2 < 5; node2++) {
        var curNode = RHnotes[layer][node1];
        var prevNode = RHnotes[layer-1][node2];
        var transCost = helpers.computeCost(prevNode.note, curNode.note, prevNode.finger, curNode.finger);
        var totalCost = transCost + prevNode.nodeScore;
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
    var curFinger = nodeObj.finger;
    var note = helpers.notes[(nodeObj.note)%12];
    bestPath.unshift([curFinger, note]); //use unshift, because otherwise we'd end up with a reversed fingering.
    currentNode = nodeObj.bestPrev;
  }
  for (var i = 0; i < bestPath.length; i++) {
    console.log('Note: ' + bestPath[i][1] + ' / Finger: ' + bestPath[i][0]);
  }
};
