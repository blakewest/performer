var helpers = require('./FingeringAlgorithmHelpers.js');

module.exports.FingeringAlgorithm = function(midiData) {
 //this whole thing is an example of Viterbi's algorithm, if you're curious.
  var dataWithStarts = helpers.addStartTimes(midiData);
  var noteTrellis = helpers.makeNoteTrellis(dataWithStarts);

  //traversing forward, computing costs and leaving our best path trail
  for (var layer = 1; layer < noteTrellis.length; layer++) {   //go through each layer (starting at 2nd, because first is just endCap)
    for (var node1 = 0; node1 < noteTrellis[layer].length ; node1++) {               //go through each node in each layer
      var min = Infinity;                 
      for (var node2 = 0; node2 < noteTrellis[layer-1].length; node2++) {               //go through each node in prev layer.
        var curNode = noteTrellis[layer][node1];
        var prevNode = noteTrellis[layer-1][node2];
        var totalCost = prevNode.nodeScore || 0;
        var curData = helpers.getSplitData(curNode);
        var prevData = helpers.getSplitData(prevNode);

        var curRH = curData.right;
        var prevRH = prevData.right;
        //if you have something in a given hand, we have to compare it with the last thing in that hand. 
        //So if the layer directly previous has nothing, we keep tracing back till we find it.
        if (curRH.notes.length > 0) {
          var counter = 2;
          var tempPrevNode = prevNode;
          while (prevRH.notes.length === 0) {
            var bestPrevious = tempPrevNode.bestPrev;
            var prevBestNode = noteTrellis[layer-counter][bestPrevious];
            prevRH = helpers.getSplitData(prevBestNode).right;
            counter++;
            tempPrevNode = prevBestNode;
          }
        }
        var curLH = curData.left;
        var prevLH = prevData.left;
        if (curLH.notes.length > 0) {
          var counter = 2;
          var tempPrevNode = prevNode;
          while (prevLH.notes.length === 0) {
            var bestPrevious = tempPrevNode.bestPrev;
            var prevBestNode = noteTrellis[layer-counter][bestPrevious];
            prevLH = helpers.getSplitData(prevBestNode).left;
            counter++;
            tempPrevNode = prevBestNode;
          }
        }

        var RHCost = helpers.calcCost(curRH, prevRH, curLH, 'RH');
        var LHCost = helpers.calcCost(curLH, prevLH, curRH, 'LH');

        totalCost += RHCost + LHCost;

       
        if (totalCost < min) {
          min = totalCost;
          curNode.nodeScore = totalCost;
          curNode.bestPrev = node2;
        }
      }
      
    }
  }
  console.log('note Trellis: ', noteTrellis);

  /*Now we need to go backwards and collect the best path.
  the currentNode variable is initialized to be the lowest score of the final layer.*/
  var currentNode = helpers.findMin(noteTrellis[noteTrellis.length-1]);

  /*from this point, we put the finger for that node in the array, then we track back to it's
  best previous node, record it's finger, and repeat till we get to the end.
  also, we set the continuation condition to be greater than zero, because we don't actually want zero, 
  since zero is just our start object.*/
  var bestPathObj = {};
  for (var j = noteTrellis.length-1; j > 0; j--) {
    // debugger;
    var nodeObj = noteTrellis[j][currentNode];
    var fingers = nodeObj.fingers;
    var notes = nodeObj.notes;
    console.log('j: ', j);
    console.log('note: ', notes);
    console.log('fingers: ', fingers);
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
  app.showData();
};
















