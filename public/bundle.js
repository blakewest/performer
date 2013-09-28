;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var params = require('./CostAlgorithmParameters.js');
var helpers = require('./CostAlgorithmHelpers.js');

var costAlgorithmRouter = function(n1,n2,f1,f2, costDatabase) {
  var key = n1.toString() + ',' + n2.toString() + ',' + f1.toString() + ',' + f2.toString();
  var noteD = Math.abs(n2-n1);
  var fingD = helpers.fingerDistance(f1,f2);

  //handles cases where the note is ascending or descending and you're using the same finger. That's move formula
  //it doesn't matter whether we send it to ascMoveFormula or descMoveFormula, since in either case, FingD is zero.
  if (Math.abs(n2 - n1) > 0 && f2-f1 === 0) {
    costDatabase[key] = helpers.ascMoveFormula(noteD,fingD,n1,n2);
  }
  //handles ascending notes and descending fingers, but f2 isn't thumb
  //means you're crossing over. Bad idea. Only plausible way to do this is picking your hand up. Thus move formula
  else if (n2 - n1 >= 0 && f2-f1 < 0 && f2 !== 1) {
    costDatabase[key] = helpers.ascMoveFormula(noteD,fingD,n1,n2,f1,f2);
  }
  //this handles descending notes with ascending fingers where f1 isn't thumb
  //means your crossing over. Same as above. Only plausible way is picking hand up, so move formula.
  else if (n2 - n1 < 0 && f2-f1 > 0 && f1 !== 1){
    costDatabase[key] = helpers.ascMoveFormula(noteD,fingD,n1,n2,f1,f2);
  }
  //this handles ascending notes, where you start on a finger that isn't your thumb, but you land on your thumb. 
  //Thus bringing your thumb under. 
  else if (n2 - n1 >= 0 && f2-f1 < 0 && f2 === 1) {
    costDatabase[key] = helpers.ascThumbCost(noteD,fingD,n1,n2,f1,f2);
  }
  //this handles descending notes, where you start on your thumb, but don't end with it. Thus your crossing over your thumb.
  else if (n2 - n1 < 0 && f1 === 1 && f2 !== 1) {
    costDatabase[key] = helpers.descThumbCost(noteD,fingD,n1,n2,f1,f2);
  }
  //this handles ascending or same note, with ascending or same finger
  //to be clear... only remaining options are (n2-n1 >= 0 && f2-f1 > 0 || n2-n1 <= 0 && f2-f1 < 0)
  else {
    var stretch = helpers.fingerStretch(f1,f2);
    var x = Math.abs(noteD - fingD) / stretch;
    if (x > params.moveCutoff) {
      costDatabase[key] = helpers.descMoveFormula(noteD,fingD,n1,n2,f1,f2);
    }else{
      costDatabase[key] = helpers.ascDescNoCrossCost(noteD,fingD,x,n1,n2,f1,f2);
    }
  }

};

var createCostDatabase = module.exports.createCostDatabase = function() {
var RHcostDatabase = {};
  for (var finger1 = 1; finger1 <=5; finger1++) {
    for (var note1 = 21; note1 < 109; note1++) { // in MIDI land, note 21 is actually the lowest note on the piano, and 109 is the highest.
      for (var finger2 = 1; finger2 <= 5; finger2++) {
        for (var note2 = 21; note2 < 109; note2++) {
          costAlgorithmRouter(note1, note2, finger1, finger2, RHcostDatabase);
        }
      }
    }
  }
  return RHcostDatabase;
};

},{"./CostAlgorithmHelpers.js":2,"./CostAlgorithmParameters.js":3}],2:[function(require,module,exports){
var params = require('./CostAlgorithmParameters.js')
var mod = module.exports;

var ThumbCrossCostFunc = function(x) {
 return 0.0002185873295*Math.pow(x,7) - 0.008611946279*Math.pow(x,6) + 0.1323250066*Math.pow(x,5) - 1.002729677*Math.pow(x,4)+
 3.884106308*Math.pow(x,3) - 6.723075747*Math.pow(x,2) + 1.581196785*x + 7.711241722;
};

var colorRules = function(n1,n2,f1,f2, fingD) {
  //if you're moving up from white to black with pinky or thumb, that's much harder than white-to-white would be. So we're adding some amount.
  if (params.color[n1%12] === 'White' && params.color[n2%12] === 'Black') {
    if (f2 === 5 || f2 === 1) {return 4;} //using thumb or pinky on black is extra expensive
    if (fingD === 0) {return 4;} //using same finger is extra expensive
  }
  if (params.color[n1%12] === 'Black' && params.color[n2%12] === 'White') {
    if (f1 === 5 || f1 === 1) {return 4;} //moving from thumb or pinky that's already on black is extra expensive
    if (fingD === 0) {return -1;} //moving black to white with same finger is a slide. That's easy and common. reduce slightly.
  }
  return 0; //if none of the rules apply, then don't add or subtract anything
};

var ascMoveFormula = mod.ascMoveFormula = function(noteD,fingD,n1,n2,f1,f2) {
  //This is for situations where direction of notes and fingers are opposite, because either way, you want to add the distance between the fingers.

  //the Math.ceil part is so it def hits a value in our moveHash. This could be fixed if I put more resolution into the moveHash
  var totalD = Math.ceil(noteD + fingD);
  var cost;

  //this adds a small amount for every additional halfstep over 24. Fairly representative of what it should be. 
  if (totalD > 24) {
    return params.moveHash[24] + ( (totalD - 24) / 5);
  }else {
    cost = params.moveHash[totalD];
    cost += colorRules(n1,n2,f1,f2,fingD);
    return cost;
  }
};

mod.descMoveFormula = function(noteD,fingD,n1,n2,f1,f2) {
  //this is for situations where direction of notes and fingers is the same. You want to subtract finger distance in that case.
  var totalD = Math.ceil(noteD - fingD);
  var cost;

  //this adds a small amount for every additional halfstep over 24. Fairly representative of what it should be. 
  if (totalD > 24) {
    return params.moveHash[24] + ( (totalD - 24) / 5);
  }else {
    cost = params.moveHash[totalD];
    cost += colorRules(n1,n2,f1,f2,fingD);
    return cost;
  }
};

//Currently assumes your on Middle C. Could potentially take into account n1 as a way to know how to handle the irregularities. Such as E-F being 1 half step, but G-A being 2.
mod.fingerDistance = function(f1,f2) {
  var key = f1.toString() + ',' + f2.toString();
  return params.fingDistance[key];
};

mod.ascThumbCost = function(noteD,fingD,n1,n2,f1,f2) {
  var stretch = ascThumbStretch(f1,f2);
  var x = (noteD + fingD) / stretch;

  //if it's over 10, again use the move formula
  if (x > 10) {
    return ascMoveFormula(noteD, fingD);
  }else {
    var cost = ThumbCrossCostFunc(x);
    if (params.color[n1%12] === 'White' && params.color[n2%12] === 'Black') {
      cost += 8;
    }
    return cost;
  }
};

mod.descThumbCost = function(noteD,fingD,n1,n2,f1,f2) {
  var stretch = descThumbStretch(f1,f2);
  var x = (noteD + fingD) / stretch;

  if (x > 10) {
    return ascMoveFormula(noteD, fingD);
  }else {
    var cost = ThumbCrossCostFunc(x);
    if (params.color[n1%12] === 'Black' && params.color[n2%12] === 'White') {
      cost += 8;
    }
    return cost;
  }
};

var descThumbStretch = mod.descThumbStretch = function(f1,f2) {
  var key = f1.toString() + ',' + f2.toString();
  return params.descThumbStretchVals[key];
};

var ascThumbStretch = mod.ascThumbStretch = function(f1,f2) {
  var key = f1.toString() + ',' + f2.toString();
  return params.ascThumbStretchVals[key];
};

mod.fingerStretch = function(f1,f2) {
  var key = f1.toString() + ',' + f2.toString();
  return params.fingStretch[key];
};

mod.ascDescNoCrossCost = function(noteD,fingD,x,n1,n2,f1,f2) {
  var costFunc = function(x) {
    return  -0.0000006589793725*Math.pow(x,10) -0.000002336381414*Math.pow(x,9) +0.00009925769823*Math.pow(x,8)+
  0.0001763353131*Math.pow(x,7)-0.004660305277*Math.pow(x,6)-0.004290746384*Math.pow(x,5)+0.06855725903*Math.pow(x,4)+
  0.03719817227*Math.pow(x,3)+0.4554696705*Math.pow(x,2)-0.08305450359*x+0.3020594956;
  };
  var cost;

  /*if it's above 6.8, but below moveCutoff, then we use an additional formula because the current one
  has an odd shape to it where it goes sharply negative after 6.8  I know this appears janky, but after messing with other potential 
  regression formulas, I can't get any single one to match both the overall shape, and certainly specific Y values I want. So this seems like best option.
  */
  if (x > 6.8 && x <= params.moveCutoff) {
    return costFunc(6.8) + ((x-6.8) *3 );
  }else{
    cost = costFunc(x);
    cost += colorRules(n1,n2,f1,f2);
    return cost;
  }
};




















},{"./CostAlgorithmParameters.js":3}],3:[function(require,module,exports){
var mod = module.exports;

mod.moveCutoff = 7.5;

mod.color = {
  0: 'White',
  1: 'Black',
  2: 'White',
  3: 'Black',
  4: 'White',
  5: 'White',
  6: 'Black',
  7: 'White',
  8: 'Black',
  9: 'White',
  10: 'Black',
  11: 'White'
};

mod.fingDistance = {
  '1,1': 0,
  '1,2': 2,
  '1,3': 3.5, // making an allowance since this seriously is either 3 or 4 about half the time.
  '1,4': 5,
  '1,5': 7,
  '2,1': 2,
  '2,2': 0,
  '2,3': 2,
  '2,4': 3.5,  //same
  '2,5': 5,
  '3,1': 3.5, // same
  '3,2': 2,
  '3,3': 0,
  '3,4': 2,
  '3,5': 3.5, //same
  '4,1': 5,
  '4,2': 3.5, //same
  '4,3': 2,
  '4,4': 0,
  '4,5': 2,
  '5,1': 7,
  '5,2': 5,
  '5,3': 3.5, //same
  '5,4': 2,
  '5,5': 0
};

var makeMoveHash = mod.makeMoveHash = function(fixedCost) {
  var moveHash = {
    1 : 0,
    2 : 0.5,
    3 : 1.8,
    4 : 3,
    5 : 5,
    6 : 7,
    7 : 8,
    8 : 8.9,
    9 : 9.7,
    10 : 10.5,
    11 : 11,
    12 : 11.4,
    13 : 11.8,
    14 : 12.2,
    15 : 12.5,
    16 : 12.8,
    17 : 13.1,
    18 : 13.4,
    19 : 13.7,
    20 : 14,
    21 : 14.3,
    22 : 14.6,
    23 : 14.9,
    24 : 15.2,
  };
  for (var each in moveHash) {
    moveHash[each] += fixedCost;
  }
  return moveHash;
};
mod.moveHash = makeMoveHash(4);

mod.descThumbStretchVals = {
  '1,2' : 1,
  '1,3' : 1,
  '1,4' : 0.9,
  '1,5' : 0.95
};

mod.ascThumbStretchVals = {
  '2,1' : 0.95,
  '3,1' : 1,
  '4,1' : 0.95,
  '5,1' : 0.95
};

mod.fingStretch = {
  '1,1' : 0.8,
  '1,2' : 1.15,
  '1,3' : 1.4,
  '1,4' : 1.45,
  '1,5' : 1.6,
  '2,1' : 1.15,
  '2,2' : 0.6,
  '2,3' : 0.9,
  '2,4' : 1.15,
  '2,5' : 1.3,
  '3,1' : 1.4,
  '3,2' : 0.9,
  '3,3' : 0.6,
  '3,4' : 0.9,
  '3,5' : 1.15,
  '4,1' : 1.45,
  '4,2' : 1.15,
  '4,3' : 0.9,
  '4,4' : 0.7,
  '4,5' : 0.7,
  '5,1' : 1.6,
  '5,2' : 1.3,
  '5,3' : 1.15,
  '5,4' : 0.8,
  '5,5' : 0.6
};

},{}],4:[function(require,module,exports){
var helpers = require('./FingeringAlgorithmHelpers.js');

module.exports.FingeringAlgorithm = function(midiData) {
 //this whole thing is an example of Viterbi's algorithm, if you're curious.
  var dataWithStarts = helpers.addStartTimes(midiData);
  //this checks if we already have the best path data for that song on the client.
  for (var i = 0; i < app.preComputed.length; i++) {
    if (app.preComputed[i].title === app.currentSong) {
      var bestPath = app.preComputed[i].BestPathObj;
      helpers.distributePath(bestPath, dataWithStarts);
      return;
    }
  }
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
    for (var k = 0; k < notes.length; k++) {
      var note = notes[k][0];
      var startTime = notes[k][1];
      var finger = fingers[k];
      var key = note + ',' + startTime;
      bestPathObj[key] = finger;
    }
    currentNode = nodeObj.bestPrev;
  }
    
  // $.post('http://localhost:3000/upload',
  // {
  //   title: 'The Tempest',
  //   artist: 'Ludwig Van Beethoven',
  //   BestPathObj: bestPathObj,
  // });

  helpers.distributePath(bestPathObj, dataWithStarts);
};

















},{"./FingeringAlgorithmHelpers.js":5}],5:[function(require,module,exports){
var RHcostDb = require('./CostAlgorithm.js').createCostDatabase();
var LHcostDb = require('./LHCostAlgorithm.js').createLHCostDatabase();

var mod = module.exports;

mod.notes = {0:'C', 1:'C#', 2:'D', 3:'Eb', 4:'E', 5:'F', 6:'F#', 7:'G', 8:'G#', 9:'A', 10:'Bb', 11:'B'};

var getAllFingerOptions = function(numFingers) {
  var results = [];
  var fingOptions = [-5,-4,-3,-2,-1,1,2,3,4,5];

  var walker = function(numFingers, currentFingers, fingerOptions) {
    if (currentFingers.length === numFingers) {
      results.push(currentFingers.slice());
      return;
    }

    for (var i = 0; i < fingerOptions.length; i++) {
      currentFingers.push(fingerOptions[i]);
      var current = currentFingers;
      var temp = fingerOptions.slice();
      temp.splice(0,i+1);
      walker(numFingers,current, temp);
      currentFingers.pop();
    }
  };
  walker(numFingers, [], fingOptions);
  return results;
};
//initialize finger options object
var allFingerOptions = {};
for (var i = 1; i <=10; i++) {
  allFingerOptions[i] = getAllFingerOptions(i);
}

var endCap = [
  {notes: ['e','e'], fingers: [1,-1]}
];

var makeNoteNode = function(notes, fingers) {
  //the notes and fingers property can have either one or multiple notes. 
  this.notes = notes;     //this is an array of array pairs, with notes and startTimes.
  this.fingers = fingers; // this is an array of finger options. 
  this.nodeScore = 0;
  this.bestPrev = undefined;
};

var makeLayer = function(notes) {
  var sortedNotes = notes.sort(function(a,b) {return a[0]-b[0]});
  var layer = [];
  var options = allFingerOptions[sortedNotes.length]; // this grabs the appropriate list of options. 
  for (var i = 0; i < options.length; i++) {
    var fingerChoice = options[i];
    var node = new makeNoteNode(sortedNotes, fingerChoice);
    layer.push(node);
  }
  return layer;
};

var makeLHLayer = function(notes) {
  var sortedNotes = notes.sort(function(a,b) {return a[0]-b[0]});
  var layer = [];
  var options = LHfingerOptions[sortedNotes.length]; // this grabs the appropriate list of options. 
  for (var i = 0; i < options.length; i++) {
    var fingerChoice = options[i];
    var node = new makeNoteNode(sortedNotes, fingerChoice);
    layer.push(node);
  }
  return layer;
};

var findNoteHolder = function(curPlaying, note) {
  for (var i = 0; i < curPlaying.length; i++) {
    if (curPlaying[i][0] === note) {
      return i;
    }
  }
};

mod.makeNoteTrellis = function(midiData) {
  // debugger;
  var curPlaying = [];
  var lastWasOn = false;
  var trellis = [];
  trellis.push(endCap); //this is convenience so we don't have to have special conditions for the traversal loop

  for (var pair = 0; pair < midiData.length; pair++) {
    var eventData = midiData[pair][0].event;
    var note = eventData.noteNumber;
    var newLayer, notePlace; 
    if (eventData.subtype === 'noteOn') {
      var startTime = eventData.startTime;
      curPlaying.push([note, startTime]);
      lastWasOn = true;
    }
    if (eventData.subtype === 'noteOff') {
      if (lastWasOn) {
        //must pass it a copy of curPlaying, or else everythang gits all messed up
        newLayer = makeLayer(curPlaying.slice());
        trellis.push(newLayer);
        notePlace = findNoteHolder(curPlaying, note);
        curPlaying.splice(notePlace, 1);
        lastWasOn = false;
      }else {
        notePlace = findNoteHolder(curPlaying, note);
        curPlaying.splice(notePlace, 1);
        lastWasOn = false;
      }
    }
  }
  return trellis;
};

var computeRHCost = function(n1,n2,f1,f2) {
  if (n1 === 'e' || n2 === 'e') {
    return 0;
  }
  var key = n1 + ',' + n2 + ',' + f1 + ',' + f2;
  var cost = RHcostDb[key];
  var distBelowC = 60-n2;
  cost += distBelowC > 0 ? distBelowC : 0; //this is for giving a slight tax to the left hand being above middle c.
  return cost;
};

var computeLHCost = function(n1,n2,f1,f2) {
  if (n1 === 'e' || n2 === 'e') {
    return 0;
  }
  f1 = Math.abs(f1);
  f2 = Math.abs(f2);
  var key = n1 + ',' + n2 + ',' + f1 + ',' + f2;
  var cost = LHcostDb[key];
  var distAboveC = n2 - 60; 
  cost += distAboveC > 0 ? distAboveC : 0; //this is for giving a slight tax to the left hand being above middle c.
  return cost;
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

mod.distributePath = function(bestPathObj, midiData) {
  var nowPlaying = {};
  for (var each in bestPathObj) {
    bestPathObj[each] = +bestPathObj[each];
  }
  for (var pair = 0; pair < midiData.length; pair++) {
    var eventData = midiData[pair][0].event;
    var note = eventData.noteNumber;
    if (eventData.subtype === 'noteOn') {
      var startTime = eventData.startTime;
      var key = note + ',' + startTime;
      var finger = bestPathObj[key];
      console.log('Note: ' + note + '/ Finger: ' + finger);
      eventData.finger = finger;
      nowPlaying[note] = finger;//adding current note to nowPlaying object. Will overwrite previous fingering of same note, which is what we want.
    }
    if (eventData.subtype === 'noteOff') {
      eventData.finger = nowPlaying[note]; //this gets the same finger from the noteOn event that 'caused' this noteOff event.
    }
  }
};

mod.addStartTimes = function(midiData) {
  //initialize counter variable at zero;
  //set first item startTime to counter variable. 
  //increment counter by TicksToNextEvent for either noteOn or noteOff events
  var curStartTime = 0;
  for (var pair = 0; pair < midiData.length; pair++) {
    var eventData = midiData[pair][0].event;
    if (eventData.subtype === 'noteOff') {
      curStartTime += eventData.deltaTime;  //deltaTime is really 'ticksToNextEvent'
    }else if(eventData.subtype === 'noteOn') {
      eventData.startTime = curStartTime;
      curStartTime += eventData.deltaTime;
    }
  }
  return midiData;
};

mod.getSplitData = function(node) {
  var result = {
    right: {
      notes: [],
      fingers:[]
    },
    left: {
      notes: [],
      fingers:[]
    }
  };
  for (var i = 0; i < node.fingers.length; i++) {
    if (node.fingers[i] > 0) {
      result.right.fingers.push(node.fingers[i]);
      result.right.notes.push(node.notes[i]);
    }else {
      result.left.fingers.push(node.fingers[i]);
      result.left.notes.push(node.notes[i]);
    }
  }
  return result;
};

mod.calcCost = function(curNode, prevNode, otherHandCurNode, whichHand) {
  var costFunction = whichHand === 'RH' ? computeRHCost : computeLHCost;
  var totalCost = 0;
  //if curNode has nothing, then that means there are no immediate notes to try out for that same hand. Thus it's temporarily only right or only left.
  //We need to return what the cost would be to move to that other note. (ie. if your left hand doens't need to play anything,
  // but your right hand is playing a note 2 octaves up, we should return that cost of the left hand jumping up to play that right hand note.)

  for (var i = 0; i < curNode.notes.length; i++) {       //go through each note in the current Node
    var curNote = curNode.notes[i][0];  //this grabs just the note, because the notes property has pairs of values. First is note, second is starTime.
    var curFinger = curNode.fingers[i];
    var hasNextNote = curNode.notes[i+1] || false;
    var nextFinger = curNode.fingers[i+1];
    if(hasNextNote) {
      //this helps add the "state" cost of actually using those fingers for that chord. This isn't captured by the transition costs 
      totalCost += costFunction(curNote, hasNextNote[0], curFinger, nextFinger);
    }else {
      totalCost += whichHand === 'RH' ? 60 - curNote : curNote - 60; //this adds a 'stateCost' for one note that helps seperate the hands where they should be.
    }
    for (var j = 0; j < prevNode.notes.length; j++) {   //add up scores for each of the previous nodes notes trying to get to current node note.
      var prevNote = prevNode.notes[j][0];
      var prevFinger = prevNode.fingers[j];

      var transCost = costFunction(prevNote, curNote, prevFinger, curFinger);
      totalCost += transCost;
    }
  }
  return totalCost;
};












},{"./CostAlgorithm.js":1,"./LHCostAlgorithm.js":6}],6:[function(require,module,exports){
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
},{"./CostAlgorithmHelpers.js":2,"./CostAlgorithmParameters.js":3}],7:[function(require,module,exports){
var KeyboardDesign = require('./Visuals/Piano/KeyboardDesign.js').KeyboardDesign;
var Keyboard = require('./Visuals/Piano/Keyboard.js').Keyboard;
var RightHand = require('./Visuals/Hands/Right/RightHand.js').RightHand;
var LeftHand = require('./Visuals/Hands/Left/LeftHand.js').LeftHand;
var Scene = require('./Visuals/Scene.js').Scene;
var createDb = require('./Algorithms/CostAlgorithm').createCostDatabase;
var fingeringAlgo = require('./Algorithms/FingeringAlgorithm.js').FingeringAlgorithm;
var PlayControls = require('./PlayControls.js').PlayControls;

module.exports.App = function() {
  //instantiate piano and hand
  this.keyboardDesign = new KeyboardDesign();
  this.keyboard = new Keyboard(this.keyboardDesign);
  console.log(this.keyboard);
  this.rightHand = new RightHand(this.keyboard);
  this.leftHand = new LeftHand(this.keyboard);
  this.player = MIDI.Player

  //maintains proper binding if later function gets called outside this scope
  var _this = this;

  //this is the callback that fires every time the MIDI.js library 'player' object registers a MIDI event of any kind.
  this.player.addListener(function(data) {
    var rightHand = _this.rightHand
    var leftHand = _this.leftHand;
    var NOTE_ON = 144
    var NOTE_OFF = 128;
    var note = data.note;
    var message = data.message;
    var finger = data.finger;

    if (message === NOTE_ON) {
      _this.keyboard.press(note);
      finger > 0 ? rightHand.press(finger, note) : leftHand.press(finger, note);
    }else if(message === NOTE_OFF) {
      _this.keyboard.release(note);
      finger > 0 ? rightHand.release(finger) : leftHand.release(finger);
    }
  });

  this.player.setAnimation({
    delay: 20,
    callback: function(data) {
      var current = data.now;
      var total = data.end;
      _this.playControls.displayProgress(current, total);
    }
  });

  this.loadMidiFile = function(midiFile, newStartPercent) {
    var _this = this;
    //just calls loadFile from the MIDI.js library, which kicks off a few calls to parse the MIDI data.
    this.player.loadFile(midiFile, function() {
      _this.playControls.setCurrentTIme(newStartPercent);
    });
  };

  this.upload = function(file) {
    // var uploadedFile = files[0];
    var _this = this;
    var reader = new FileReader();
    reader.onload = function(e) {
      var midiFile = e.target.result;
      _this.loadMidiFile(midiFile);
    };
    reader.readAsDataURL(file);
  };

  this.initScene = function() {
    var _this = this;
    this.scene = new Scene('#canvas');
    this.scene.add(this.keyboard.model);
    this.scene.add(this.rightHand.model);
    this.scene.add(this.leftHand.model);
    // scene.animate(function() {
    //   _this.keyboard.update();
    //   _this.rightHand.update();
    // });
    this.scene.animate(function() {
      _this.keyboard.update();
      _this.rightHand.update();
      _this.leftHand.update();
      TWEEN.update();
    });
  };

  this.initMIDI = function(callback) {
    MIDI.loadPlugin(function() {
      MIDI.channels[9].mute = true;
    });
    if (typeof callback === 'function') {
      callback();
    }
  };

  this.initPlayControls = function(container, app) {
    _this.playControls = new PlayControls(container, app);
  };

  this.fingeringAlgorithm = function() {
    fingeringAlgo(_this.player.data);
  };
};




































},{"./Algorithms/CostAlgorithm":1,"./Algorithms/FingeringAlgorithm.js":4,"./PlayControls.js":9,"./Visuals/Hands/Left/LeftHand.js":14,"./Visuals/Hands/Right/RightHand.js":20,"./Visuals/Piano/Keyboard.js":26,"./Visuals/Piano/KeyboardDesign.js":27,"./Visuals/Scene.js":29}],8:[function(require,module,exports){
var App = require('./App.js').App;
$(document).on('ready', function() {
  var app = window.app = new App(); //maybe put the whole app in a name space(like b), then if you need to refer to it, you can  refer to app as b.app
  $.ajax({
    url: '/getAllPaths',
    // dataType: 'text',
    success: function(data) {
      var allPaths = JSON.parse(data);
      console.log('data after GET request...', allPaths);
      app.preComputed = allPaths;
    }
  });
  console.log('app Pre Computed = ', app.preComputed);
  app.initMIDI();
  app.initPlayControls($('.main-container'), app);
  app.initScene();
  setTimeout(function() {
    $($('.player-songList > li')[0]).trigger('click');
  }, 1500);
});



},{"./App.js":7}],9:[function(require,module,exports){
module.exports.PlayControls = function(container, app) {
  var $container = $(container);
  var $songListContainer = $('.player-songListContainer', this.$container);
  var $controlsContainer = $('.player-controls', this.$container);
  var $progressContainer = $('.player-progress-container', this.$container);

  var $progressBar = $('.player-progress-bar', this.$container);
  var $progressText = $('.player-progress-text', this.$container);
  var $songList = $('.player-songList', this.$container);
  var $song = $('.song', this.$container);
  var $tempoChanger = $('.tempo-changer', this.$container);

  var $playBtn = $('.player-playBtn', this.$container);
  var $pauseBtn = $('.player-pauseBtn', this.$container);

  var $currentSong = $('.current-song')

  var _this = this;

  $playBtn.click(function() {
    if (_this.playing === false) {
      _this.resume();
    }else {
      _this.play();
    }
  });
  $pauseBtn.click(function() {
    _this.pause();
  });

  $songList.on('click', function(event) {
    var $target = $(event.target);
    var trackName = $target.text();
    $currentSong.text(trackName);
    _this.playing = false;
    app.currentSong = trackName;
    console.log(app.currentSong);
    $.ajax({
      url: '/songs/'+trackName,
      dataType: 'text',
      success: function(data) {
        app.loadMidiFile(data, 0);
      }
    });
    console.log('songlist click getting called');
  });

  $progressContainer.click(function(event){
    console.log('progress container is getting clicked');
    var progressPercent = (event.clientX - $progressContainer.offset().left) / $progressContainer.width();
    console.log(progressPercent);
    _this.setCurrentTIme(progressPercent);
  });

  $tempoChanger.click(function(event) {
    var $target = $(event.target);
    var timeWarp = $target.find('input').attr('data-timeWarp');
    console.log(timeWarp);
    app.player.timeWarp = timeWarp;
    var trackName = app.currentSong;
    $.ajax({
      url: '/songs/'+trackName,
      dataType: 'text',
      success: function(data) {
        var currentProgress = $progressBar.width()/$progressContainer.width();
        app.loadMidiFile(data,  currentProgress);
      }
    });
  })

  // $container.on('mousewheel', function(event) {
  //     event.stopPropagation();
  //   });

  this.play = function() {
    console.log('play is getting called');
    $playBtn.hide();
    $pauseBtn.show();
    _this.playing = true;
    app.player.resume();
  };

  this.resume = function() {
    $playBtn.hide();
    $pauseBtn.show();
    app.player.currentTime += 1e-6; //fixed bug in MIDI.js
    _this.playing = true;
    console.log('resume is getting called');
    app.player.resume();
  };

  this.stop = function() {
    app.player.stop();
    _this.playing = false;
  };

  this.pause = function() {
    console.log('pause is getting called');
    _this.playing = false;
    $playBtn.show();
    $pauseBtn.hide();
    app.player.pause();
    _this.resume();
  };

  this.getEndTime = function() {
    return app.player.endTime;
  };

  this.displayProgress = function(current, total) {
    var percent = current/total;
    var newWidth = Math.floor(percent*$progressContainer.width());
    $progressBar.width(newWidth);
  };

  this.setCurrentTIme = function(progressPercent) {
    console.log('set current time is getting called');
    var currentTime = app.player.endTime * progressPercent;
    app.player.currentTime = currentTime;
    setTimeout(_this.resume, 10);
    app.player.pause();
  };
};
},{}],10:[function(require,module,exports){
//this is our 'Dummy' finger, so that we can book-end the Hand 'children' arrays, and not have to write janky neighbor note code.
var Dummy = module.exports.Dummy = function() {
  var Geometry = new THREE.CubeGeometry(1,1,1);
  var Material = new THREE.MeshLambertMaterial({color: 0x0000});
  var Position = new THREE.Vector3(0, 0, 0);
  this.model = new THREE.Mesh(Geometry, Material);
  this.model.position.copy(Position);
  this.model.visible = false;
};

},{}],11:[function(require,module,exports){
var params = require('./FingerMoveParams.js').params;

module.exports.Finger = function(Keyboard) {
  var pressAmount = 0.6;
  this.originalY = 0.2; // this is just a default. each finger will actually overwrite this as necessary.
  this.pressedY = this.originalY - pressAmount;
  this.releaseSpeed = 0.05;
  this.moveSpeed = 0.1;
  // this.newX = this.model.position.x;
  // this.currentX = this.model.position.x;
  var keyboard = Keyboard;
  this.distances = params(keyboard);

  this.press = function(note) {
    this.moveToNote(note);
    this.model.position.y = this.pressedY;
    this.isPressed = true;
  };
  this.release = function() {
    this.isPressed = false;
  };

  this.moveToNote = function(noteNum) {
    this.currentPos.x = this.model.position.x;
    this.currentPos.y = this.model.position.y;
    this.currentPos.z = this.model.position.z;
    
    //logic about checking to see if neighbor is already on the note you want to play. 
    var aboveNeighbor = this.model.parent.children[this.number+1].currentNote;
    var belowNeighbor = this.model.parent.children[this.number-1].currentNote;
    if (noteNum > this.model.currentNote) {
      if (aboveNeighbor === noteNum) {
        this.model.currentNote = noteNum-1;
      }else {
        this.model.currentNote = noteNum;
      }
    }
    else if (noteNum < this.model.currentNote) {
      if(belowNeighbor === noteNum) {
        this.model.currentNote = noteNum+1;
      }else {
        this.model.currentNote = noteNum;
      }
    }

    this.setNewPos(this.model.currentNote);
    console.log('Finger: ' + this.number + '/ Note: ' + this.model.currentNote);
    this.setUpNewTween();
  };

  this.update = function() {
    if (this.model.position.y < this.originalY && this.isPressed === false) {
      var offset = this.originalY - this.model.position.y;
      this.model.position.y += Math.min(offset, this.releaseSpeed);
    }
  };

  //just initializing values here. They'll get overwritten immediately;
  this.currentPos = {
    x: 0,
    y: 0,
    z: 0
  };

  this.newPos = {
    x: 0,
    y: 0,
    z: 0
  };

  this.setNewPos = function(noteNum) {
    this.newPos.x = keyboard.model.children[noteNum-21].position.x;
    this.newPos.y = keyboard.keys[noteNum].model.position.y + this.originalY;
    this.newPos.z = keyboard.keys[noteNum].model.position.z + 0.5;
  };

  this.setUpNewTween = function() {
    var _this = this;
    var update = function() {
      _this.model.position.x = _this.currentPos.x;
      _this.model.position.y = _this.currentPos.y+0.1;
      _this.model.position.z = _this.currentPos.z;
    };
    var easing = TWEEN.Easing.Quadratic.Out;

    var tween = new TWEEN.Tween(this.currentPos)
      .to(this.newPos, 150)
      .easing(easing)
      .onUpdate(update);

    tween.start();
  };
  this.setUpPressReleaseTween = function() {
    //TO DO
  };
};































},{"./FingerMoveParams.js":12}],12:[function(require,module,exports){
module.exports.params = function(keyboard) {
  //should contain distance from one note to another, in half steps;
  var distances = {};
  distances.get = function(note1, note2) {
    //we add in the +21 to offset the fact that the notes got stripped to an 88 key keyboard, and yet, MIDI notes act as if note 0 on the keyboard
    //is note no. 21
    return keyboard.model.children[note2-21].position.x - keyboard.model.children[note1-21].position.x;
  };
  return distances;
};

module.exports.distances = function(note1, note2) {
}
},{}],13:[function(require,module,exports){
module.exports.HandDesign = function(keyboard) {
  //pinky specs
  this.pinkyWidth = 0.14;
  this.pinkyHeight = 0.1;
  this.pinkyLength = 0.57;
  this.pinkyColor = 0xFF0000;

  //ring finger specs
  this.ringFingerWidth = 0.18;
  this.ringFingerHeight = 0.1;
  this.ringFingerLength = 0.61;
  this.ringFingerColor = 0x006600;

  //middle finger specs
  this.middleFingerWidth = 0.185;
  this.middleFingerHeight = 0.1;
  this.middleFingerLength = 0.7;
  this.middleFingerColor = 0x0033FF;

  //index finger specs
  this.indexFingerWidth = 0.188;
  this.indexFingerHeight = 0.1;
  this.indexFingerLength = 0.60;
  this.indexFingerColor = 0xFFFF00;

  //thumb specs
  this.thumbWidth = 0.175;
  this.thumbHeight = 0.1;
  this.thumbLength = 0.5;
  this.thumbColor = 0xFF33FF;

  this.keyboard = keyboard;
  this.keyboardHeight = 0.22;
};
},{}],14:[function(require,module,exports){
var LeftPinky        = require('./LeftPinky.js').LeftPinky;
var LeftRing         = require('./LeftRing.js').LeftRing;
var LeftMiddle     = require('./LeftMiddle.js').LeftMiddle;
var LeftIndex       = require('./LeftIndex.js').LeftIndex;
var LeftThumb    = require('./LeftThumb.js').LeftThumb;
var HandDesign  = require('../HandDesign.js').HandDesign;
var Dummy          = require('../Dummy.js').Dummy;

module.exports.LeftHand = function(keyboard) {
  var _this = this;
  //we're passing in the keyboard to the hand design. That way, the design/layout of the keyboard can be arbitrary, and each finger will know where to play a "C60", wherever it is.
  var handDesign = new HandDesign(keyboard);
  var pinky = new LeftPinky(handDesign, 'left');
  var ring = new LeftRing(handDesign, 'left');
  var middle = new LeftMiddle(handDesign, 'left');
  var index = new LeftIndex(handDesign, 'left');
  var thumb = new LeftThumb(handDesign, 'left');
  var dummy1 = new Dummy();
  var dummy2 = new Dummy();

  this.fingers = [];
  this.model = new THREE.Object3D();

  //add fingers to hand model
  this.fingers.push(undefined); // these are here to make off by 1 errors go away. We want finger 1 to be thumb so that semantically it makes sense)
  this.model.add(dummy1.model)
  dummy1.model.currentNote = -1;

  this.model.add(thumb.model);
  this.fingers.push(thumb);
  thumb.model.currentNote = 1;

  this.model.add(index.model);
  this.fingers.push(index);
  index.model.currentNote = 1;

  this.model.add(middle.model);
  this.fingers.push(middle);
  middle.model.currentNote = 1;

  this.model.add(ring.model);
  this.fingers.push(ring);
  ring.model.currentNote = 1;

  this.model.add(pinky.model);
  this.fingers.push(pinky);
  pinky.model.currentNote = 1;

  this.model.add(dummy2.model);
  dummy2.model.currentNote = 110;

  thumb.moveToNote(55);
  index.moveToNote(53);
  middle.moveToNote(52);
  ring.moveToNote(50);
  pinky.moveToNote(48);

  //set position of hand
  this.model.position.y -= 0.22 / 2;  // the 0.22 is the keyboard height (defined in KeyboardDesign.js)

  this.model.traverse(function(object) {
    object.position.x -= 4.45;
  });


  this.offSet = 0.2222;

  this.press = function(finger, noteNum) {
    finger = Math.abs(finger);
    // console.log('the left ' + finger + ' finger is trying to press');
    var newPosition = keyboard.keys[noteNum].model.position.x;
    for (var i = 1; i <= 5; i++) {
      if (i === finger) {
        _this.fingers[i].press(noteNum);
      }else{
        _this.fingers[i].moveAsNeeded(finger, newPosition, noteNum);
      }
    }
  };

  this.release = function(finger) {
    finger = Math.abs(finger);
      _this.fingers[finger].release();
  };

  this.update = function() {
    var fingers = _this.fingers;
    for (var i = 1; i < fingers.length; i++) {
      fingers[i].update();
    }
  };
};

















},{"../Dummy.js":10,"../HandDesign.js":13,"./LeftIndex.js":15,"./LeftMiddle.js":16,"./LeftPinky.js":17,"./LeftRing.js":18,"./LeftThumb.js":19}],15:[function(require,module,exports){
var Finger = require('../Finger.js').Finger;

var LeftIndex = module.exports.LeftIndex = function(handInfo) {
  Finger.call(this, handInfo.keyboard);
  var indexFingerGeometry = new THREE.CubeGeometry(handInfo.indexFingerWidth, handInfo.indexFingerHeight, handInfo.indexFingerLength);
  var indexFingerMaterial = new THREE.MeshLambertMaterial({color: handInfo.indexFingerColor});
  var indexFingerPosition = new THREE.Vector3(0, 0.20, 0.4);
  this.model = new THREE.Mesh(indexFingerGeometry, indexFingerMaterial);
  this.model.position.copy(indexFingerPosition);
  this.originalY = indexFingerPosition.y;
  this.number = 2;
  var dist = this.distances;

  this.moveAsNeeded = function(finger, newPosition, newNote) {
    var curX = this.currentPos.x;
    var delta = newPosition - curX;
    var curNote = this.model.currentNote;
    switch (finger) {
    case 5:
      this.pinkyRules(delta, curX, curNote, newNote);
      break;
    case 4:
      this.ringRules(delta, curX, curNote, newNote);
      break;
    case 3:
      this.middleRules(delta, curX, curNote, newNote);
      break;
    case 1:
      this.thumbRules(delta, curX, curNote, newNote);
      break;
    }
  };

  this.pinkyRules = function(delta, curX, curNote, newNote) {
    if ( delta >= dist.get(curNote, curNote-8) && delta <= dist.get(curNote, curNote-4)) { //this is like the 'stretch' zone
      return;
    } else { //definitely move
      this.moveToNote(newNote + 5);
    }
  };
  this.ringRules = function(delta, curX, curNote, newNote) {
    if ( delta >= dist.get(curNote, curNote-6) && delta <= dist.get(curNote, curNote-4) ) {
      return;
    }else {
      this.moveToNote(newNote + 3);
    }
  };
  this.middleRules = function(delta, curX, curNote, newNote) {
    if ( delta >= dist.get(curNote, curNote-5) && delta <= dist.get(curNote, curNote-1) ) {
      return;
    }else {
      this.moveToNote(newNote + 4);
    }
  };
  this.thumbRules = function(delta, curX, curNote, newNote) {
    if ( delta > 0 && delta <= dist.get(curNote, curNote + 4) ) {
      return;
    }else if (delta > dist.get(curNote, curNote-3) && delta < 0) {
      var _this = this;
      setTimeout(_this.moveToNote(newNote - 2), 100);
    }
    else {
      this.moveToNote(newNote - 2);
    }
  };
};

LeftIndex.prototype = Object.create(Finger.prototype);
LeftIndex.prototype.constructor = LeftIndex;

},{"../Finger.js":11}],16:[function(require,module,exports){
var Finger = require('../Finger.js').Finger;

var LeftMiddle = module.exports.LeftMiddle = function(handInfo) {
  Finger.call(this, handInfo.keyboard);
  var middleFingerGeometry = new THREE.CubeGeometry(handInfo.middleFingerWidth, handInfo.middleFingerHeight, handInfo.middleFingerLength);
  var middleFingerMaterial = new THREE.MeshLambertMaterial({color: handInfo.middleFingerColor});
  var middleFingerPosition = new THREE.Vector3(0, 0.20, 0.4);
  this.model = new THREE.Mesh(middleFingerGeometry, middleFingerMaterial);
  this.model.position.copy(middleFingerPosition);
  this.originalY = middleFingerPosition.y;
  this.number = 3;
  var dist = this.distances;

  this.moveAsNeeded = function(finger, newPosition, newNote) {
    var curX = this.currentPos.x;
    var delta = newPosition - curX;
    var curNote = this.model.currentNote;
    switch (finger) {
    case 5:
      this.pinkyRules(delta, curX, curNote, newNote);
      break;
    case 4:
      this.ringRules(delta, curX, curNote, newNote);
      break;
    case 2:
      this.indexRules(delta, curX, curNote, newNote);
      break;
    case 1:
      this.thumbRules(delta, curX, curNote, newNote);
    }
  };

  this.pinkyRules = function(delta, curX, curNote, newNote) {
    if ( delta > dist.get(curNote, curNote-5) && delta < dist.get(curNote, curNote-3) ) { //this is like the 'stretch' zone
      return;
    } else { //definitely move
      this.moveToNote(newNote+3);
    }
  };
  this.ringRules = function(delta, curX, curNote, newNote) {
    if ( delta > dist.get(curNote, curNote-4) && delta < dist.get(curNote, curNote-1) ) {
      return;
    }else {
      this.moveToNote(newNote+2);
    }
  };
  this.indexRules = function(delta, curX, curNote, newNote) {
    if ( delta > 0 && delta < dist.get(curNote, curNote+3) ) {
      return;
    }else {
      this.moveToNote(newNote-2);
    }
  };
  this.thumbRules = function(delta, curX, curNote, newNote) {
    if ( delta > 0 && delta < dist.get(curNote, curNote+6) ) {
      return;
    } else if (delta > dist.get(curNote, curNote-4) && delta < 0) {    //this is the thumb crossing under
      var _this = this;
      setTimeout(_this.moveToNote(newNote-3), 100); //this is so you have some delay before the fingers move back over the thumb. A tad more realistic
    }
    else {
      this.moveToNote(newNote-3);
    }
  };
};

LeftMiddle.prototype = Object.create(Finger.prototype);
LeftMiddle.prototype.constructor = LeftMiddle;

},{"../Finger.js":11}],17:[function(require,module,exports){
var Finger = require('../Finger.js').Finger;

var LeftPinky = module.exports.LeftPinky = function(handInfo) {
  Finger.call(this, handInfo.keyboard);
  var pinkyGeometry = new THREE.CubeGeometry(handInfo.pinkyWidth, handInfo.pinkyHeight, handInfo.pinkyLength);
  var pinkyMaterial = new THREE.MeshLambertMaterial({color: handInfo.pinkyColor})
  var pinkyPosition = new THREE.Vector3(0, 0.20, 0.54);
  this.model = new THREE.Mesh(pinkyGeometry, pinkyMaterial);
  this.model.position.copy(pinkyPosition);
  this.originalY = pinkyPosition.y;
  this.number = 5;
  var dist = this.distances;

  this.moveAsNeeded = function(finger, newPosition, newNote) {
    var curX = this.currentPos.x;
    var delta = newPosition - curX;
    var curNote = this.model.currentNote;
    switch (finger) {
    case 4:
      this.ringRules(delta, curX, curNote, newNote);
      break;
    case 3:
      this.middleRules(delta,curX, curNote, newNote);
      break;
    case 2:
      this.indexRules(delta,curX, curNote, newNote);
      break;
    case 1:
      this.thumbRules(delta,curX, curNote, newNote);
    }
  };

  this.ringRules = function(delta, curX, curNote, newNote) {
    if ( delta > 0 && delta <= dist.get(curNote, curNote+3)) { //this is like the 'stretch' zone
      return;
    } else { //definitely move
      this.moveToNote(newNote - 2);
    }
  };
  this.middleRules = function(delta, curX, curNote, newNote) {
    if ( delta > 0 && delta <= dist.get(curNote, curNote + 5) ) {
      return;
    }else {
      this.moveToNote(newNote - 3);
    }
  };
  this.indexRules = function(delta, curX, curNote, newNote) {
    if ( delta > 0 && delta <= dist.get(curNote, curNote + 7) ) {
      return;
    }else {
      this.moveToNote(newNote - 5);
    }
  };
  this.thumbRules = function(delta, curX, curNote, newNote) {
    if ( delta > 0 && delta <= dist.get(curNote, curNote + 12) ) {
      return;
    } else if (delta > 0 && delta <= dist.get(curNote, curNote + 1) ) {
      var _this = this;
      setTimeout(_this.moveToNote(newNote-7), 100);
    }
    else {
      this.moveToNote(newNote-7);
    }
  };
  this.setUpNewTween = function() {
    var _this = this;
    var update = function() {
      _this.model.position.x = _this.currentPos.x;
      _this.model.position.y = _this.currentPos.y +0.1;
      _this.model.position.z = _this.currentPos.z + 0.1;
    };
    var easing = TWEEN.Easing.Quadratic.Out;

    var tween = new TWEEN.Tween(this.currentPos)
      .to(this.newPos, 150)
      .easing(easing)
      .onUpdate(update);

    tween.start();
  };
};

LeftPinky.prototype = Object.create(Finger.prototype);
LeftPinky.prototype.constructor = LeftPinky;

},{"../Finger.js":11}],18:[function(require,module,exports){
var Finger = require('../Finger.js').Finger;

var LeftRing = module.exports.LeftRing = function(handInfo) {
  Finger.call(this, handInfo.keyboard);
  var ringFingerGeometry = new THREE.CubeGeometry(handInfo.ringFingerWidth, handInfo.ringFingerHeight, handInfo.ringFingerLength);
  var ringFingerMaterial = new THREE.MeshLambertMaterial({color: handInfo.ringFingerColor});
  var ringFingerPosition = new THREE.Vector3(0, 0.20, 0.45);
  this.model = new THREE.Mesh(ringFingerGeometry, ringFingerMaterial);
  this.model.position.copy(ringFingerPosition);
  this.originalY = ringFingerPosition.y;
  this.number = 4;
  var dist = this.distances;

  this.moveAsNeeded = function(finger, newPosition, newNote) {
    var curX = this.currentPos.x;
    var delta = newPosition - curX;
    var curNote = this.model.currentNote;
    switch (finger) {
    case 5:
      this.pinkyRules(delta, curX, curNote, newNote);
      break;
    case 3:
      this.middleRules(delta, curX, curNote, newNote);
      break;
    case 2:
      this.indexRules(delta, curX, curNote, newNote);
      break;
    case 1:
      this.thumbRules(delta, curX, curNote, newNote);
    }
  };

  this.pinkyRules = function(delta, curX, curNote, newNote) {
    if ( delta > dist.get(curNote, curNote -3) && delta < dist.get(curNote, curNote-2)) { //this is like the 'stretch' zone
      return;
    } else { //definitely move
      this.moveToNote(newNote + 2);
    }
  };
  this.middleRules = function(delta, curX, curNote, newNote) {
    if ( delta > 0 && delta < dist.get(curNote, curNote + 3) ) {
      return;
    }else {
      this.moveToNote(newNote - 2);
    }
  };
  this.indexRules = function(delta, curX, curNote, newNote) {
    if ( delta > 0 && delta < dist.get(curNote, curNote + 5) ) {
      return;
    }else {
      this.moveToNote(newNote - 3);
    }
  };
  this.thumbRules = function(delta, curX, curNote, newNote) {
    if ( delta > 0 && delta < dist.get(curNote, curNote + 8) ) {
      return;
    } else if (delta > dist.get(curNote, curNote -2) && delta < 0) {             //this is thumb crossing under
      var _this = this;
      setTimeout(_this.moveToNote(newNote - 5), 100);
    }
    else {
      this.moveToNote(newNote - 5);
    }
  };
};

LeftRing.prototype = Object.create(Finger.prototype);
LeftRing.prototype.constructor = LeftRing;

},{"../Finger.js":11}],19:[function(require,module,exports){
var Finger = require('../Finger.js').Finger;

var LeftThumb = module.exports.LeftThumb = function(handInfo) {
  Finger.call(this, handInfo.keyboard);
  var thumbGeometry = new THREE.CubeGeometry(handInfo.thumbWidth, handInfo.thumbHeight, handInfo.thumbLength);
  var thumbMaterial = new THREE.MeshLambertMaterial({color: handInfo.thumbColor});
  var thumbPosition = new THREE.Vector3(0, 0.30, 0.6);
  this.model = new THREE.Mesh(thumbGeometry, thumbMaterial);
  this.model.position.copy(thumbPosition);
  this.originalY = thumbPosition.y;
  this.number = 1;
  var dist = this.distances;

  this.moveAsNeeded = function(finger, newPosition, newNote) {
    var curX = this.currentPos.x;
    var delta = newPosition - curX;
    var curNote = this.model.currentNote;
    switch (finger) {
    case 5:
      this.pinkyRules(delta, curX, curNote, newNote);
      break;
    case 4:
      this.ringRules(delta, curX, curNote, newNote);
      break;
    case 3:
      this.middleRules(delta, curX, curNote, newNote);
      break;
    case 2:
      this.indexRules(delta, curX, curNote, newNote);
    }
  };

  this.pinkyRules = function(delta, curX, curNote, newNote) {
    if ( delta >= dist.get(curNote, curNote-12) && delta <= dist.get(curNote, curNote-5) )  { //this is like the 'stretch' zone
      return;
    } else if (delta > 0 && delta < dist.get(curNote, curNote+1)) { //this is when the pinky crosses over thumb
      var _this = this;
      setTimeout(_this.moveToNote(newNote + 7), 100);
    }else { //definitely move
      this.moveToNote(newNote + 7);
    }
  };
  this.ringRules = function(delta, curX, curNote, newNote) {
    if ( delta >= dist.get(curNote, curNote-9) && delta <= dist.get(curNote, curNote-4)) {
      return;
    }else if (delta > 0 && delta < dist.get(curNote, curNote+2)) { //this is when the ring crosses over thumb
      var _this = this;
      setTimeout(_this.moveToNote(newNote + 5), 100);
    }else {
      this.moveToNote(newNote + 5);
    }
  };
  this.middleRules = function(delta, curX, curNote, newNote) {
    if ( delta >= dist.get(curNote, curNote-7) && delta <= dist.get(curNote, curNote-2)) {
      return;
    }else if (delta > 0 && delta < dist.get(curNote, curNote+4)) { //this is when the middle crosses over thumb
      var _this = this;
      setTimeout(_this.moveToNote(newNote + 4), 100);
    }else {
      this.moveToNote(newNote + 4);
    }
  };
  this.indexRules = function(delta, curX, curNote, newNote) {
    if ( delta >= dist.get(curNote, curNote-4) && delta < 0 ) {
      return;
    }else if (delta > 0 && delta < dist.get(curNote, curNote+2)) { //this is when the index crosses over thumb
      var _this = this;
      setTimeout(_this.moveToNote(newNote + 2), 100);
    }else {
      this.moveToNote(newNote + 2);
    }
  };
  this.setUpNewTween = function() {
    var _this = this;
    var update = function() {
      _this.model.position.x = _this.currentPos.x;
      _this.model.position.y = _this.currentPos.y + 0.1
      _this.model.position.z = _this.currentPos.z + 0.2;
    };
    var easing = TWEEN.Easing.Quadratic.Out;

    var tween = new TWEEN.Tween(this.currentPos)
      .to(this.newPos, 150)
      .easing(easing)
      .onUpdate(update);

    tween.start();
  };
};

LeftThumb.prototype = Object.create(Finger.prototype);
LeftThumb.prototype.constructor = LeftThumb;

},{"../Finger.js":11}],20:[function(require,module,exports){
var RightPinky = require('./RightPinky.js').RightPinky;
var RightRing = require('./RightRing.js').RightRing;
var RightMiddle = require('./RightMiddle.js').RightMiddle;
var RightIndex = require('./RightIndex.js').RightIndex;
var RightThumb = require('./RightThumb.js').RightThumb;
var HandDesign = require('../HandDesign.js').HandDesign;
var Dummy         = require('../Dummy.js').Dummy;

module.exports.RightHand = function(keyboard) {
  var _this = this;
  //we're passing in the keyboard to the hand design. That way, the design/layout of the keyboard can be arbitrary, and each finger will know where to play a "C60" or whatever.
  var handDesign = new HandDesign(keyboard); 
  var pinky = new RightPinky(handDesign, 'right');
  var ring = new RightRing(handDesign, 'right');
  var middle = new RightMiddle(handDesign, 'right');
  var index = new RightIndex(handDesign, 'right');
  var thumb = new RightThumb(handDesign, 'right');
  var dummy1 = new Dummy();
  var dummy2 = new Dummy();

  this.fingers = [];
  this.model = new THREE.Object3D();

  //add fingers to hand model

  this.fingers.push(undefined); // these are here to make the off by 1 errors go away. (We want finger 1 to be thumb so that semantically it makes sense)
  this.model.add(dummy1.model)
  dummy1.model.currentNote = -1;

  this.model.add(thumb.model);
  this.fingers.push(thumb);
  thumb.model.currentNote = 5;

  this.model.add(index.model);
  this.fingers.push(index);
  index.model.currentNote = 1;

  this.model.add(middle.model);
  this.fingers.push(middle);
  middle.model.currentNote = 1;

  this.model.add(ring.model);
  this.fingers.push(ring);
  ring.model.currentNote = 1;

  this.model.add(pinky.model);
  this.fingers.push(pinky);
  pinky.model.currentNote = 1;

  this.model.add(dummy2.model);
  dummy2.model.currentNote = 110;

  thumb.moveToNote(60);
  index.moveToNote(62);
  middle.moveToNote(64);
  ring.moveToNote(65);
  pinky.moveToNote(67);

  this.model.position.y -= 0.22 / 2; // the 0.22 is the keyboard height (defined in KeyboardDesign.js)
  this.model.traverse(function(object) {
    object.position.x -= 4.45;
  });

  console.log('RH object: ', this.model);

  this.press = function(finger, noteNum) {
    // console.log('the right ' + finger + ' finger is trying to press');
    var newPosition = keyboard.keys[noteNum].model.position.x;
    for (var i = 1; i <= 5; i++) {
      if (i === finger) {
        _this.fingers[i].press(noteNum);
      }else{
        _this.fingers[i].moveAsNeeded(finger,newPosition, noteNum);
      }
    }
  };

  this.release = function(finger) {
    _this.fingers[finger].release();
  };

  this.update = function() {
    var fingers = _this.fingers;
    for (var i = 1; i < fingers.length; i++) {
      fingers[i].update();
    }
  };
};
},{"../Dummy.js":10,"../HandDesign.js":13,"./RightIndex.js":21,"./RightMiddle.js":22,"./RightPinky.js":23,"./RightRing.js":24,"./RightThumb.js":25}],21:[function(require,module,exports){
var Finger = require('../Finger.js').Finger;

var RightIndex = module.exports.RightIndex = function(handInfo) {
  Finger.call(this, handInfo.keyboard);
  var indexFingerGeometry = new THREE.CubeGeometry(handInfo.indexFingerWidth, handInfo.indexFingerHeight, handInfo.indexFingerLength);
  var indexFingerMaterial = new THREE.MeshLambertMaterial({color: handInfo.indexFingerColor});
  var indexFingerPosition = new THREE.Vector3(0, 0.20, 0.4);
  this.model = new THREE.Mesh(indexFingerGeometry, indexFingerMaterial);
  this.model.position.copy(indexFingerPosition);
  this.originalY = indexFingerPosition.y;
  this.number = 2;
  var dist = this.distances;

  this.moveAsNeeded = function(finger, newPosition, newNote) {
    var curX = this.currentPos.x;
    var delta = newPosition - curX;
    var curNote = this.model.currentNote;
    switch (finger) {
    case 5:
      this.pinkyRules(delta, curX, curNote, newNote);
      break;
    case 4:
      this.ringRules(delta,curX, curNote, newNote);
      break;
    case 3:
      this.middleRules(delta,curX, curNote, newNote);
      break;
    case 1:
      this.thumbRules(delta,curX, curNote, newNote);
    }
  };

  this.pinkyRules = function(delta, curX, curNote, newNote) {
    if ( delta > dist.get(curNote, curNote+4) && delta < dist.get(curNote, curNote+8)) { //this is like the 'stretch' zone
      return;
    } else { //definitely move
      this.moveToNote(newNote - 5);
    }
  };
  this.ringRules = function(delta, curX, curNote, newNote) {
    if ( delta > dist.get(curNote, curNote+3) && delta < dist.get(curNote, curNote+7) ) {
      return;
    }else {
      this.moveToNote(newNote-3);
    }
  };
  this.middleRules = function(delta, curX, curNote, newNote) {
    if ( delta > dist.get(curNote, curNote+2) && delta < dist.get(curNote, curNote+5) ) {
      return;
    }else {
      this.moveToNote(newNote-2);
    }
  };
  this.thumbRules = function(delta, curX, curNote, newNote) {
    if ( delta > dist.get(curNote, curNote-3) && delta < 0) {
      return;
    }else if (delta > 0 && delta < dist.get(curNote, curNote+3)) {
      var _this = this;
      setTimeout(_this.moveToNote(newNote+2), 100);
    }
    else {
      this.moveToNote(newNote+2);
    }
  };
};

RightIndex.prototype = Object.create(Finger.prototype);
RightIndex.prototype.constructor = RightIndex;

},{"../Finger.js":11}],22:[function(require,module,exports){
var Finger = require('../Finger.js').Finger;

var RightMiddle = module.exports.RightMiddle = function(handInfo) {
  Finger.call(this, handInfo.keyboard);
  var middleFingerGeometry = new THREE.CubeGeometry(handInfo.middleFingerWidth, handInfo.middleFingerHeight, handInfo.middleFingerLength);
  var middleFingerMaterial = new THREE.MeshLambertMaterial({color: handInfo.middleFingerColor});
  var middleFingerPosition = new THREE.Vector3(0, 0.20, 0.4);
  this.model = new THREE.Mesh(middleFingerGeometry, middleFingerMaterial);
  this.model.position.copy(middleFingerPosition);
  this.originalY = middleFingerPosition.y;
  this.number = 3;
  var dist = this.distances;

  this.moveAsNeeded = function(finger, newPosition, newNote) {
    var curX = this.currentPos.x;
    var delta = newPosition - curX;
    var curNote = this.model.currentNote;
    switch (finger) {
    case 5:
      this.pinkyRules(delta, curX, curNote, newNote);
      break;
    case 4:
      this.ringRules(delta,curX, curNote, newNote);
      break;
    case 2:
      this.indexRules(delta,curX, curNote, newNote);
      break;
    case 1:
      this.thumbRules(delta,curX, curNote, newNote);
    }
  };

  this.pinkyRules = function(delta, curX, curNote, newNote) {
    if ( delta >= dist.get(curNote, curNote+3) && delta <= dist.get(curNote, curNote+5)) { //this is like the 'stretch' zone
      return;
    } else { //definitely move
      this.moveToNote(newNote - 3);
    }
  };
  this.ringRules = function(delta, curX, curNote, newNote) {
    if ( delta >= dist.get(curNote, curNote+1) && delta <= dist.get(curNote, curNote+4) ) {
      return;
    }else {
      this.moveToNote(newNote - 2);
    }
  };
  this.indexRules = function(delta, curX, curNote, newNote) {
    if ( delta >= dist.get(curNote, curNote-3) && delta <= dist.get(curNote, curNote-1) ) {
      return;
    }else {
      this.moveToNote(newNote + 2);
    }
  };
  this.thumbRules = function(delta, curX, curNote, newNote) {
    if ( delta >= dist.get(curNote, curNote-6) && delta < 0 ) {
      return;
    } else if (delta > 0 && delta < dist.get(curNote, curNote+4)) {
      var _this = this;
      setTimeout(_this.moveToNote(newNote+3), 100);
    }
    else {
      this.moveToNote(newNote+3);
    }
  };
};

RightMiddle.prototype = Object.create(Finger.prototype);
RightMiddle.prototype.constructor = RightMiddle;

},{"../Finger.js":11}],23:[function(require,module,exports){
var Finger = require('../Finger.js').Finger;

var RightPinky = module.exports.RightPinky = function(handInfo) {
  Finger.call(this, handInfo.keyboard);
  var pinkyGeometry = new THREE.CubeGeometry(handInfo.pinkyWidth, handInfo.pinkyHeight, handInfo.pinkyLength);
  var pinkyMaterial = new THREE.MeshLambertMaterial({color: handInfo.pinkyColor})
  var pinkyPosition = new THREE.Vector3(0, 0.20, 0.54);
  this.model = new THREE.Mesh(pinkyGeometry, pinkyMaterial);
  this.model.position.copy(pinkyPosition);
  this.originalY = pinkyPosition.y;
  this.number = 5;
  var dist = this.distances;

  this.moveAsNeeded = function(finger, newPosition, newNote) {
    var curX = this.currentPos.x;
    var delta = newPosition - curX;
    var curNote = this.model.currentNote;
    switch (finger) {
    case 5:
      this.ringRules(delta, curX, curNote, newNote);
      break;
    case 3:
      this.middleRules(delta,curX, curNote, newNote);
      break;
    case 2:
      this.indexRules(delta,curX, curNote, newNote);
      break;
    case 1:
      this.thumbRules(delta,curX, curNote, newNote);
    }
  };

  this.ringRules = function(delta, curX, curNote, newNote) {
    if ( delta > dist.get(curNote, curNote-3) && delta < 0) { //this is like the 'stretch' zone
      return;
    } else { //definitely move
      this.moveToNote(newNote + 2);
    }
  };
  this.middleRules = function(delta, curX, curNote, newNote) {
    if ( delta > dist.get(curNote, curNote-5) && delta < 0 ) {
      return;
    }else {
      this.moveToNote(newNote + 3);
    }
  };
  this.indexRules = function(delta, curX, curNote, newNote) {
    if ( delta > dist.get(curNote, curNote-7) && delta < 0 ) {
      return;
    }else {
      this.moveToNote(newNote + 5);
    }
  };
  this.thumbRules = function(delta, curX, curNote, newNote) {
    if ( delta > dist.get(curNote, curNote-12) && delta < 0 ) {
      return;
    } else if (delta > 0 && delta < dist.get(curNote, curNote+1)) {
      var _this = this;
      setTimeout(_this.moveToNote(newNote+7), 100);
    }
    else {
      this.moveToNote(newNote+7);
    }
  };
  this.setUpNewTween = function() {
    var _this = this;
    var update = function() {
      _this.model.position.x = _this.currentPos.x;
      _this.model.position.y = _this.currentPos.y +0.1;
      _this.model.position.z = _this.currentPos.z + 0.1;
    };
    var easing = TWEEN.Easing.Quadratic.Out;

    var tween = new TWEEN.Tween(this.currentPos)
      .to(this.newPos, 150)
      .easing(easing)
      .onUpdate(update);

    tween.start();
  };
};

RightPinky.prototype = Object.create(Finger.prototype);
RightPinky.prototype.constructor = RightPinky;

},{"../Finger.js":11}],24:[function(require,module,exports){
var Finger = require('../Finger.js').Finger;

var RightRing = module.exports.RightRing = function(handInfo) {
  Finger.call(this, handInfo.keyboard);
  var ringFingerGeometry = new THREE.CubeGeometry(handInfo.ringFingerWidth, handInfo.ringFingerHeight, handInfo.ringFingerLength);
  var ringFingerMaterial = new THREE.MeshLambertMaterial({color: handInfo.ringFingerColor});
  var ringFingerPosition = new THREE.Vector3(0, 0.20, 0.45);
  this.model = new THREE.Mesh(ringFingerGeometry, ringFingerMaterial);
  this.model.position.copy(ringFingerPosition);
  this.originalY = ringFingerPosition.y;
  this.number = 4;
  var dist = this.distances;

  this.moveAsNeeded = function(finger, newPosition, newNote) {
    var curX = this.currentPos.x;
    var delta = newPosition - curX;
    var curNote = this.model.currentNote;
    switch (finger) {
    case 5:
      this.pinkyRules(delta, curX, curNote, newNote);
      break;
    case 3:
      this.middleRules(delta,curX, curNote, newNote);
      break;
    case 2:
      this.indexRules(delta,curX, curNote, newNote);
      break;
    case 1:
      this.thumbRules(delta,curX, curNote, newNote);
    }
  };

  this.pinkyRules = function(delta, curX, curNote, newNote) {
    if ( delta > dist.get(curNote, curNote+2) && delta < dist.get(curNote, curNote+3)) { //this is like the 'stretch' zone
      return;
    } else { //definitely move
      this.moveToNote(newNote - 2);
    }
  };
  this.middleRules = function(delta, curX, curNote, newNote) {
    if ( delta > dist.get(curNote, curNote-3) && delta < 0 ) {
      return;
    }else {
      this.moveToNote(newNote + 2);
    }
  };
  this.indexRules = function(delta, curX, curNote, newNote) {
    if ( delta > dist.get(curNote, curNote-5) && delta < 0 ) {
      return;
    }else {
      this.moveToNote(newNote + 3);
    }
  };
  this.thumbRules = function(delta, curX, curNote, newNote) {
    if ( delta > dist.get(curNote, curNote-8) && delta < 0 ) {
      return;
    } else if (delta > 0 && delta < dist.get(curNote, curNote+2)) {
      var _this = this;
      setTimeout(_this.moveToNote(newNote+5), 100);
    }
    else {
      this.moveToNote(newNote+5);
    }
  };
};

RightRing.prototype = Object.create(Finger.prototype);
RightRing.prototype.constructor = RightRing;

},{"../Finger.js":11}],25:[function(require,module,exports){
var Finger = require('../Finger.js').Finger;

var RightThumb = module.exports.RightThumb = function(handInfo) {
  Finger.call(this, handInfo.keyboard);
  var thumbGeometry = new THREE.CubeGeometry(handInfo.thumbWidth, handInfo.thumbHeight, handInfo.thumbLength);
  var thumbMaterial = new THREE.MeshLambertMaterial({color: handInfo.thumbColor});
  var thumbPosition = new THREE.Vector3(0, 0.30, 0.6);
  this.model = new THREE.Mesh(thumbGeometry, thumbMaterial);
  this.model.position.copy(thumbPosition);
  this.originalY = thumbPosition.y;
  this.number = 1;
  var dist = this.distances;

  this.moveAsNeeded = function(finger, newPosition, newNote) {
    var curX = this.currentPos.x;
    var delta = newPosition - curX;
    var curNote = this.model.currentNote;
    switch (finger) {
    case 5:
      this.pinkyRules(delta, curX, curNote, newNote);
      break;
    case 4:
      this.ringRules(delta, curX, curNote, newNote);
      break;
    case 3:
      this.middleRules(delta, curX, curNote, newNote);
      break;
    case 2:
      this.indexRules(delta, curX, curNote, newNote);
    }
  };

  this.pinkyRules = function(delta, curX, curNote, newNote) {
    if ( delta >= dist.get(curNote, curNote+5) && delta < dist.get(curNote, curNote+12) ) { //this is like the 'stretch' zone
      return;
    }else if (delta >= dist.get(curNote, curNote-2) && delta < 0) { //this is when the index lightly crosses over thumb
      var _this = this;
      setTimeout(_this.moveToNote(newNote-7), 100);
    }else { //definitely move
      this.moveToNote(newNote - 7);
    }
  };
  this.ringRules = function(delta, curX, curNote, newNote) {
    if ( delta >= dist.get(curNote, curNote+4) && delta <= dist.get(curNote, curNote+9)) {
      return;
    }else if (delta > dist.get(curNote, curNote-2) && delta < 0) { //this is when the index lightly crosses over thumb
      var _this = this;
      setTimeout(_this.moveToNote(newNote-5), 100);
    }else {
      this.moveToNote(newNote - 5);
    }
  };
  this.middleRules = function(delta, curX, curNote, newNote) {
    if ( delta >= dist.get(curNote, curNote+2) && delta <= dist.get(curNote, curNote+7)) {
      return;
    }else if (delta > dist.get(curNote, curNote-3) && delta < 0) { //this is when the index lightly crosses over thumb
      var _this = this;
      setTimeout(_this.moveToNote(newNote-4), 100);
    }else {
      this.moveToNote(newNote - 4);
    }
  };
  this.indexRules = function(delta, curX, curNote, newNote) {
    if ( delta > 0 && delta <= dist.get(curNote, curNote+4) ) {
      return;
    }else if (delta > dist.get(curNote, curNote-2) && delta < 0) { //this is when the index lightly crosses over thumb
      var _this = this;
      setTimeout(_this.moveToNote(newNote-2), 100);
    }else {
      this.moveToNote(newNote-2);
    }
  };
  this.setUpNewTween = function() {
    var _this = this;
    var update = function() {
      _this.model.position.x = _this.currentPos.x;
      _this.model.position.y = _this.currentPos.y + 0.1;
      _this.model.position.z = _this.currentPos.z + 0.2;
    };
    var easing = TWEEN.Easing.Quadratic.Out;

    var tween = new TWEEN.Tween(this.currentPos)
      .to(this.newPos, 150)
      .easing(easing)
      .onUpdate(update);

    tween.start();
  };
};

RightThumb.prototype = Object.create(Finger.prototype);
RightThumb.prototype.constructor = RightThumb;

},{"../Finger.js":11}],26:[function(require,module,exports){
var PianoKey = require("./PianoKey.js").PianoKey;

module.exports.Keyboard = function(keyboardDesign) {
  //keyboard design is a completed object where we've filled it out with note types and parameters. See keyboardDesign.js file for more.
  this.model = new THREE.Object3D();
  this.keys = [];
  var _this = this;

  //build the actual keyboard
  for (var note = 0; note < keyboardDesign.keyInfo.length; note++) {
    var key = new PianoKey(keyboardDesign, note);
    _this.keys.push(key);
    if (note > 20 && note < 109) { //strips to 88 keys
      this.model.add(key.model);
    }
  }
  this.model.position.y -= keyboardDesign.whiteKeyHeight / 2;
  // this.model.translateX(-2.1);
  //this centers the keyboard infront of the camera.
  this.model.traverse(function(object) {
    object.position.x -= 4.45;
  });

  this.press = function(note) {
    _this.keys[note].press();
  };

  this.release = function(note) {
    _this.keys[note].release();
  };

  this.update = function() {
    var _this = this;
    var allKeys = _this.keys;
    for (var i = 0; i < allKeys.length; i++) {
      allKeys[i].update();
    }
  };
};
},{"./PianoKey.js":28}],27:[function(require,module,exports){
module.exports.KeyboardDesign = function() {
  this.KeyType = {
    WhiteC:  0,
    WhiteD: 1,
    WhiteE:  2,
    WhiteF:  3,
    WhiteG: 4,
    WhiteA: 5,
    WhiteB: 6,
    Black:   7
  };

  this.whiteKeyStep                  = 0.236;
  this.whiteKeyWidth                = 0.226;
  this.whiteKeyHeight               = 0.22;
  this.whiteKeyLength               = 1.50;
  this.blackKeyWidth                 =0.10;
  this.blackKeyHeight               = 0.24;
  this.blackKeyLength               = 1.00;
  this.blackKeyShiftCDE            = 0.0216;
  this.blackKeyShiftFGAB           = 0.0340;
  this.blackKeyPosY                   = 0.10;
  this.blackKeyPosZ                   = -0.24;
  this.noteDropPosZ4WhiteKey  = 0.25;
  this.noteDropPosZ4BlackKey  = 0.75;
  this.whiteKeyColor                  = 0xf0ffff;
  this.blackKeyColor                  = 0x000000;
  this.keyDip                             = 0.08;
  this.keyUpSpeed                     = 0.03;
  this.keyInfo                            = [] ;// an array holding each key's type and position

  var _this = this;
  //essentially an initialization function
  var createBoardInfo = function() {
    makeNoteObjects();
    initKeyType();
    initKeyPos();
  };

  var makeNoteObjects = function() {
    for (var i = 0; i < 120; i++) {
      var noteObj = {};
      _this.keyInfo.push(noteObj);
    }
  };

  var initKeyType = function() {
    var KeyType = _this.KeyType;
    var keyInfo = _this.keyInfo;
    for (var i = 0; i< 10; i++) {
      var noteNo = 12*i;
      keyInfo[noteNo + 0].keyType = KeyType.WhiteC;
      keyInfo[noteNo + 1].keyType = KeyType.Black;
      keyInfo[noteNo + 2].keyType = KeyType.WhiteD;
      keyInfo[noteNo + 3].keyType = KeyType.Black;
      keyInfo[noteNo + 4].keyType = KeyType.WhiteE;
      keyInfo[noteNo + 5].keyType = KeyType.WhiteF;
      keyInfo[noteNo + 6].keyType = KeyType.Black;
      keyInfo[noteNo + 7].keyType = KeyType.WhiteG;
      keyInfo[noteNo + 8].keyType = KeyType.Black;
      keyInfo[noteNo + 9].keyType = KeyType.WhiteA;
      keyInfo[noteNo + 10].keyType = KeyType.Black;
      keyInfo[noteNo + 11].keyType = KeyType.WhiteD;
    }
  };

  var initKeyPos = function() {
    //setting up convenience vars
    var keyInfo         = _this.keyInfo;
    var KeyType        = _this.KeyType;
    var prevKeyType = KeyType.WhiteB;
    var noteNo         = 0;
    var posX             = 0.0;
    var shift             = 0.0;
    var Black            = KeyType.Black;

    //setting position of first note;
    keyInfo[noteNo].keyCenterPosX = posX;
    prevKeyType = keyInfo[noteNo].keyType;

    //set position of all the rest of the notes.

    for ( noteNo = 1; noteNo< keyInfo.length; noteNo++) {
      if (prevKeyType === Black) {
        posX += _this.whiteKeyStep / 2.0;
      }else {
        if (keyInfo[noteNo].keyType === Black) {
          posX += _this.whiteKeyStep / 2.0;
        }else {
          posX += _this.whiteKeyStep;
        }
      }
      keyInfo[noteNo].keyCenterPosX = posX;
      prevKeyType = keyInfo[noteNo].keyType;
    }

  };

  //calling initialization function
  createBoardInfo();
};





























},{}],28:[function(require,module,exports){
var PianoKey = module.exports.PianoKey = function(boardInfo, note) {
  //set up some convenience vars
  var Black                    = boardInfo.KeyType.Black;
  var keyType               = boardInfo.keyInfo[note].keyType;
  var keyCenterPosX     = boardInfo.keyInfo[note].keyCenterPosX;
  var keyUpSpeed         = boardInfo.keyUpSpeed;

  //set up necessary components for making a Mesh.
  var geometry, material, position;
  if (keyType === Black) {
    geometry = new THREE.CubeGeometry(boardInfo.blackKeyWidth, boardInfo.blackKeyHeight, boardInfo.blackKeyLength);
    material   = new THREE.MeshPhongMaterial({color: boardInfo.blackKeyColor});
    position   = new THREE.Vector3(keyCenterPosX, boardInfo.blackKeyPosY, boardInfo.blackKeyPosZ);
    this.originalColor = {r: 0, g: 0, b: 0};
  }else {
    geometry = new THREE.CubeGeometry(boardInfo.whiteKeyWidth, boardInfo.whiteKeyHeight, boardInfo.whiteKeyLength);
    material   = new THREE.MeshPhongMaterial( {color: boardInfo.whiteKeyColor, emissive: 0x111111} );
    position   = new THREE.Vector3(keyCenterPosX, boardInfo.whiteKeyPosY, boardInfo.whiteKeyPosZ);
    this.originalColor = {r: 0.941, g: 1, b: 1};
  }

  //make the key Mesh
  this.model = new THREE.Mesh(geometry, material);
  this.model.position.copy(position);

  //set helper properties
  this.keyUpSpeed = boardInfo.keyUpSpeed;
  this.originalY = position.y;
  this.pressedY = this.originalY - boardInfo.keyDip;
  this.newColor = {r: 0, g: 0, b: 0};
  this.currentColor = {r: this.originalColor.r, g: this.originalColor.g, b: this.originalColor.b}; //weird syntax here so original color never gets modified. 
};

PianoKey.prototype.press = function() {
  this.model.position.y = this.pressedY;
  this.newColor = {r: 0.145, g: 0.749, b: 0.854};
  this.setUpNewTween();
  this.isPressed = true;
};

PianoKey.prototype.release = function() {
  this.isPressed = false;
  this.newColor = this.originalColor;
  this.setUpNewTween();
};

PianoKey.prototype.update = function() {
  //this is really about making released notes edge up slowly, rather than quickly
  if (this.model.position.y < this.originalY && this.isPressed === false) {
    //offset will keep getting smaller as the model's position gets raised by keyUpSpeed because update runs 60 times/second.
    var offset = this.originalY - this.model.position.y;
    this.model.position.y += Math.min(offset, this.keyUpSpeed);
  }
};

PianoKey.prototype.setUpNewTween = function() {
  var _this = this;
  var update = function() {
    _this.model.material.color.setRGB(_this.currentColor.r, _this.currentColor.g, _this.currentColor.b);
  };
  var easing = TWEEN.Easing.Quadratic.Out;

  var tween = new TWEEN.Tween(this.currentColor)
    .to(this.newColor, 150)
    .easing(easing)
    .onUpdate(update);

  tween.start();
};
},{}],29:[function(require,module,exports){
module.exports.Scene = function(container) {
  var $container = $(container);
  var width = $container.width();
  var height = $container.height();
  var _this = this;

  //create scene
  var scene = new THREE.Scene();

  //create camera
  var view_angle = 85;
  var aspect = width/height;
  var near = 0.001;
  var far = 1000;
  var camera = new THREE.PerspectiveCamera(view_angle, aspect, near, far);
  // camera.lookAt(new THREE.Vector3());
  camera.position.set(0, 3.0, 1.2);
  camera.lookAt(new THREE.Vector3(10,50,5));
  // camera.rotation.y = 0 * Math.PI / 180;
  // camera.rotation.x = -30 * Math.PI / 180;
  // camera.rotation.z = 0 * Math.PI / 180;

  var controls = new THREE.TrackballControls(camera);
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;

  controls.noZoom = false;
  controls.noPan = false;

  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;

  controls.keys = [ 65, 83, 68 ];

  //create and append renderer
  var renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 1);
  renderer.autoClear = false;
  $container.append(renderer.domElement);

  //create lights
  var ambientLight = new THREE.AmbientLight(0x222222);

  var mainLight = new THREE.DirectionalLight(0xffffff, 0.8)
  mainLight.position.set(1,2,4).normalize();

  var auxLight = new THREE.DirectionalLight(0xffffff, 0.3);
  auxLight.position.set(-4,-1,-2).normalize;

  //add everything to the scene
  scene.add(ambientLight);
  scene.add(mainLight);
  scene.add(auxLight);
  scene.add(camera);

  //set props for return object
  this.camera =   camera;
  this.renderer = renderer;
  this.scene =     scene;

  this.add = function(object) {
    scene.add(object);
  };
  this.animate = function(callback) {
    requestAnimationFrame(function() {
      _this.animate(callback);
    });
    if ( typeof callback === 'function') {
      callback();
    }
    controls.update();
    _this.renderer.render(_this.scene, _this.camera);
  };
};
},{}]},{},[8])
;