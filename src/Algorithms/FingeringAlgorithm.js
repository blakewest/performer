var helpers = require('./FingeringAlgorithmHelpers.js');

module.exports.FingeringAlgorithm = function(midiData) {
 // This whole thing is an example of Viterbi's algorithm, if you're curious.

  var dataWithStarts = helpers.addStartTimes(midiData);
  // This checks if we already have the best path data for that song on the client.
  // Well aware this is a janky way to do it. Didn't have time to implement better back-end data response obj.
  for (var i = 0; i < app.preComputed.length; i++) {
    if (app.preComputed[i].title === app.currentSong) {
      var bestPath = app.preComputed[i].BestPathObj;
      helpers.distributePath(bestPath, dataWithStarts);
      return;
    }
  }
  var noteTrellis = helpers.makeNoteTrellis(dataWithStarts);

  // Traversing forward, computing costs and leaving our best path trail
  for (var layer = 1; layer < noteTrellis.length; layer++) {   // Go through each layer (starting at 2nd, because first is just endCap)
    for (var node1 = 0; node1 < noteTrellis[layer].length ; node1++) {               // Go through each node in each layer
      var min = Infinity;
      for (var node2 = 0; node2 < noteTrellis[layer-1].length; node2++) {               // Go through each node in prev layer.
        var curNode = noteTrellis[layer][node1];
        var prevNode = noteTrellis[layer-1][node2];
        var totalCost = prevNode.nodeScore || 0;
        var curData = helpers.getSplitData(curNode);
        var prevData = helpers.getSplitData(prevNode);

        var curRH = curData.right;
        var prevRH = prevData.right;
        // If you have something in a given hand, we have to compare it with the last thing in that hand. 
        // So if the layer directly previous has nothing, we keep tracing back till we find it.
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
  /* Now we need to go backwards and collect the best path.
  the currentNode variable is initialized to be the lowest score of the final layer.*/
  var currentNode = helpers.findMin(noteTrellis[noteTrellis.length-1]);

  /* From this point, we put the finger for that node in the array, then we track back to it's
  best previous node, record it's finger, and repeat till we get to the end.
  We set the continuation condition to be greater than zero, because we don't actually want zero, 
  since zero is just our start object.*/
  
  var bestPathObj = {};
  for (var j = noteTrellis.length-1; j > 0; j--) {
    var nodeObj = noteTrellis[j][currentNode];
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
  
  // Was using this as simple way post songs to our Database. Didn't want to write a whole form yet.
  // and don't want to allow arbitrary songs to get posted.

  // $.post('http://localhost:3000/upload',
  // {
  //   title: 'Yesterday',
  //   artist: 'The Beatles',
  //   BestPathObj: bestPathObj,
  // });

  helpers.distributePath(bestPathObj, dataWithStarts);
};
















