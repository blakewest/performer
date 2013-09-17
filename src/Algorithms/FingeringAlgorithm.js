var costDb = require('./CostAlgorithm.js').createCostDatabase();
var chosenPath = [3];
var oddScores = [];

var findNextFinger = function(RHnotes, curNote, f1, totalScore) {
  //take in the options, pick the lowest cost one directly infront.
  var n1 = RHnotes[curNote];
  var n2 = RHnotes[curNote+1];

  if (n2 === undefined) {
    return totalScore;
  }
  var min = 1000; //some arbitrary high number.
  var bestOption;
  for (var j = 1; j <= 5; j++) {
    var key = n1.toString() + ',' + n2.toString() + ',' + f1.toString() + ',' + j.toString();
    if (costDb[key] < min) {
      min = costDb[key];
      bestOption = j;
    }
  }
  totalScore += min;
  curNote += 1;
  chosenPath.push([bestOption, min]);
  if (min < 0) {
    oddScores.push([bestOption, min]);
  }
  return findNextFinger(RHnotes, curNote, bestOption, totalScore);
};


module.exports.FingeringAlgorithm = function(midiData) {
  //I want to construct an array of NoteOn events in the order they appear for the right hand. 
  //I then need to walk across every possible option, and as I walk down the paths, I need to discard them as soon as I can. 
    var RHnotes = [];

    for (var pair = 0; pair < midiData.length; pair++) {
      var eventData = midiData[pair][0].event;
      var note = eventData.noteNumber
      if (eventData.noteNumber >= 60 && eventData.subtype === "noteOn") {
        RHnotes.push(note);

      }
    }
    //go through rh notes, start with thumb on first note. Always pick lowest cost option directly infront of you. adding to a total score 
    var bestScore = findNextFinger(RHnotes, 0, 3, 0);
    console.log(midiData);
    console.log('Right Hand: ', RHnotes);
    console.log('Total score: ', bestScore);
    console.log('Chosen path : ', chosenPath);
    console.log('oddScores : ', oddScores);
};









        // if (eventData.subtype === 'noteOn') {
        //   eventData.finger = fakeFingeringData[counter];
        //   counter++;
        // }


        // if (eventData.noteNumber >= 60) {
        //   RHnotes.push(note);
        // }else {
        //   // LHnotes.push(note);
        // }


    // var LHnotes = [];
    // ["E", "E", "E", "E", "F", "G", "F", "G", "G", "F", "G", "E", "F", "D", "E", "C", "D", "C", "C", "D", "C", "E", "D", "E", "E", "D", "E", "D", "D", "E", "D", "E", "E", "F",
    //  "E", "G", "F", "G", "G", "F", "G", "E", "F", "D", "E", "C", "D", "C", "C", "D", "C", "E", "D", "D", "E", "C", "D", "C", "C", "C"]

    // var fakeFingeringData = [
    //   3,3,3,3,4,5,4,5,5,4,5,3,4,2,3,1,2,1,1,2,1,3,2,3,3,2,3,2,2,3,2,3,3,4,3,5,4,5,5,4,5,3,4,2,3,1,2,1,1,2,1,3,2,2,3,1,2,1,1,1
    // ];
    // var counter = 0;








