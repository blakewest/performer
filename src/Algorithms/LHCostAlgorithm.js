var params = require('./CostAlgorithmParameters.js');
var helpers = require('./CostAlgorithmHelpers.js');

var LHcostAlgorithmRouter = function(n1,n2,f1,f2, costDatabase) {
  var key = n1.toString() + ',' + n2.toString() + ',' + f1.toString() + ',' + f2.toString();
  var noteD = Math.abs(n2-n1);
  var fingD = helpers.fingerDistance(f1,f2);

  //handles cases where the note is ascending or descending and you're using the same finger. That's move formula
  //it doesn't matter whether we send it to ascMoveFormula or descMoveFormula, since in either case, FingD is zero.
  if (noteD > 0 && f2-f1 === 0) {
    costDatabase[key] = helpers.ascMoveFormula(noteD,fingD,n1,n2);
  }
  //handles descending notes and descending fingers, but f2 isn't thumb
  //means you're crossing over. Bad idea. Only plausible way to do this is picking your hand up. Thus move formula
  else if (n2 - n1 <= 0 && f2-f1 < 0 && f2 !== 1) {
    costDatabase[key] = helpers.ascMoveFormula(noteD,fingD);
  }
  //this handles ascending notes with ascending fingers where f1 isn't thumb
  //means your crossing over. Same as above. Only plausible way is picking hand up, so move formula.
  else if (n2 - n1 > 0 && f2-f1 > 0 && f1 !== 1){
    costDatabase[key] = helpers.ascMoveFormula(noteD,fingD);
  }
  //this handles descending notes, where you start on a finger that isn't your thumb, but you land on your thumb. 
  //Thus bringing your thumb under. 
  else if (n2 - n1 <= 0 && f2-f1 < 0 && f2 === 1) {
    costDatabase[key] = helpers.ascThumbCost(noteD,fingD,n1,n2,f1,f2);
  }
  //this handles ascending notes, where you start on your thumb, but don't end with it. Thus your crossing over your thumb.
  else if (n2 - n1 >= 0 && f1 === 1 && f2 !== 1) {
    costDatabase[key] = helpers.descThumbCost(noteD,fingD,n1,n2,f1,f2);
  }
  //this handles ascending or same note, with descending fingers or it takes descending notes with ascending fingers
  //to be clear... only remaining options are (n2-n1 >= 0 && f2-f1 < 0 || n2-n1 <= 0 && f2-f1 > 0)
  else {
    var stretch = helpers.fingerStretch(f1,f2);
    var x = Math.abs(noteD - fingD) / stretch;
    if (x > params.moveCutoff) {
      costDatabase[key] = helpers.descMoveFormula(noteD, fingD);
    }else{
      costDatabase[key] = helpers.ascDescNoCrossCost(noteD,fingD,x,n1,n2,f1,f2);
    }
  }
};

var createLHCostDatabase = module.exports.createLHCostDatabase = function() {
  var LHcostDatabase = {};
  for (var finger1 = 1; finger1 <=5; finger1++) {
    for (var note1 = 21; note1 < 109; note1++) { // in MIDI land, note 21 is actually the lowest note on the piano, and 109 is the highest.
      for (var finger2 = 1; finger2 <= 5; finger2++) {
        for (var note2 = 21; note2 < 109; note2++) {
          LHcostAlgorithmRouter(note1, note2, finger1, finger2, LHcostDatabase);
        }
      }
    }
  }
  return LHcostDatabase;
};