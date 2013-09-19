var helpers = require('./FingeringAlgorithmHelpers.js');

module.exports.FingeringAlgorithm = function(midiData) {
 //this whole thing is an example of Viterbi's algorithm, if you're curious.
  var dataWithStarts = helpers.addStartTimes(midiData);
  var RHnotes = helpers.makeRHNoteTrellis(dataWithStarts);
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
          var curNote = curNode.notes[i][0];  //this grabs just the note, because the notes property has pairs of values. First is note, second is starTime.
          var curFinger = curNode.fingers[i];
          var hasNextNote = curNode.notes[i+1] || false;
          var nextFinger = curNode.fingers[i+1];
          if(hasNextNote) {
            //this helps add the "state" cost of actually using those fingers for that chord. This isn't captured by the transition costs 
            totalCost += helpers.computeCost(curNote, hasNextNote[0], curFinger, nextFinger);
          }
          for (var j = 0; j < prevNode.notes.length; j++) {   //add up scores for each of the previous nodes notes trying to get to current node note.
            var prevNote = prevNode.notes[j][0];
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
  console.log('RH notes: ', RHnotes);

  /*Now we need to go backwards and collect the best path.
  the currentNode variable is initialized to be the lowest score of the final layer.*/
  var currentNode = helpers.findMin(RHnotes[RHnotes.length-1]);

  /*from this point, we put the finger for that node in the array, then we track back to it's
  best previous node, record it's finger, and repeat till we get to the end.
  also, we set the continuation condition to be greater than zero, because we don't actually want zero, 
  since zero is just our start object.*/
  var bestPathObj = {};
  for (var j = RHnotes.length-1; j > 0; j--) {
    var nodeObj = RHnotes[j][currentNode];
    var fingers = nodeObj.fingers;
    var notes = nodeObj.notes;
    for (var k = 0; k < notes.length; k++) {
      var note = notes[k][0];
      var startTime = notes[k][1];
      var finger = fingers[k];
      var key = note + ',' + startTime;
      bestPathObj[key] = finger;
    }
    currentNode = nodeObj.bestPrev;
  }
  helpers.distributePath(bestPathObj, dataWithStarts);
};

















