var color = {
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

var fingDistance = {
  '1,1': 0,
  '1,2': 2,
  '1,3': 3.5,
  '1,4': 5,
  '1,5': 7,
  '2,1': 2,
  '2,2': 0,
  '2,3': 2,
  '2,4': 3.5,  // making an allowance since this seriously is either 3 or 4 about half the time.
  '2,5': 5,
  '3,1': 3.5, // same thing
  '3,2': 2,
  '3,3': 0,
  '3,4': 2,
  '3,5': 3.5,
  '4,1': 5,
  '4,2': 3.5,
  '4,3': 2,
  '4,4': 0,
  '4,5': 2,
  '5,1': 7,
  '5,2': 5,
  '5,3': 3.5,
  '5,4': 2,
  '5,5': 0
};

//this is assuming a 'fixed cost' of 3
var makeMoveHash = function(fixedCost) {
  var MoveHash = {
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

  for (var each in MoveHash) {
    MoveHash[each] += fixedCost;
  }
  return MoveHash;
};

var moveHash = makeMoveHash(3);

//this is fairly naive way of defining natural distance between two fingers.
//It assumes your on Middle C. Could potentially take into account n1 as a way to know how to handle the irregularities. Such as E-F being 1 half step, but G-A being 2.
var fingerDistance = function(f1,f2) {
  var key = f1.toString() + ',' + f2.toString();
  return fingDistance[key];
};

var dThumbStretch = {
  '1,2' : 1,
  '1,3' : 1,
  '1,4' : 0.9,
  '1,5' : 0.8
};

var aThumbStretch = {
  '2,1' : 0.95,
  '3,1' : 1,
  '4,1' : 0.95,
  '5,1' : 0.8
};

var fingStretch = {
  '1,1' : 0.8,
  '1,2' : 1.15,
  '1,3' : 1.3,
  '1,4' : 1.45,
  '1,5' : 1.6,
  '2,1' : 1.15,
  '2,2' : 0.6,
  '2,3' : 0.9,
  '2,4' : 1.15,
  '2,5' : 1.3,
  '3,1' : 1.3,
  '3,2' : 0.9,
  '3,3' : 0.6,
  '3,4' : 0.9,
  '3,5' : 1.15,
  '4,1' : 1.45,
  '4,2' : 1.15,
  '4,3' : 0.9,
  '4,4' : 0.7,
  '4,5' : 0.8,
  '5,1' : 1.6,
  '5,2' : 1.3,
  '5,3' : 1.15,
  '5,4' : 0.8,
  '5,5' : 0.7
};

var ascendingThumbCost = function(noteD,fingD,n1,n2,f1,f2) {
  var stretch = ascendingThumbStretch(f1,f2);

  var x = (noteD + fingD) / stretch;

  //if it's over 10, again use the move formula
  if (x > 10) {
    return ascMoveFormula(noteD, fingD);
  }else {

     var y = ThumbCrossCostFunc(x);
    if (color[n1%12] === 'White' && color[n2%12] === 'Black') {
      y += 8;
    }
    return y;
  }
};

var descendingThumbCost = function(noteD,fingD,f1,f2) {
  var stretch = descendingThumbStretch(f1,f2);

  var x = (noteD + fingD) / stretch;

  if (x > 10) {
    return ascMoveFormula(noteD, fingD);
  }else {
    return ThumbCrossCostFunc(x);
  }

};

var descendingThumbStretch = function(f1,f2) {
  var key = f1.toString() + ',' + f2.toString();
  return dThumbStretch[key];
};

var ascendingThumbStretch = function(f1,f2) {
  var key = f1.toString() + ',' + f2.toString();
  return aThumbStretch[key];
};

var fingerStretch = function(f1,f2) {
  var key = f1.toString() + ',' + f2.toString();
  return fingStretch[key];
};

var ThumbCrossCostFunc = function(x) {
  //this effectively shifts our graph over so that it centers over zero, instead of 4. This allows us to use
  //absolute value, which is what we want, since the shape of our graph below zero is wack. 
  // x = Math.abs(x-3);
  
//   return -0.0003112526902*Math.pow(x,7)+0.01885042991*Math.pow(x,6)-
// 0.4641792923*Math.pow(x,5)+6.02919054*Math.pow(x,4)-44.66602087*Math.pow(x,3)+
// 189.4583817*Math.pow(x,2)-427.7666473*x+400.1590843;
 return 0.0002185873295*Math.pow(x,7) - 0.008611946279*Math.pow(x,6) + 0.1323250066*Math.pow(x,5) - 1.002729677*Math.pow(x,4)+
 3.884106308*Math.pow(x,3) - 6.723075747*Math.pow(x,2) + 1.581196785*x + 7.711241722;
};

var nonThumbCost = function(noteD,fingD,x) {

  var costFunc = function(x) {
    return  -0.0000006589793725*Math.pow(x,10) -0.000002336381414*Math.pow(x,9) +0.00009925769823*Math.pow(x,8)+
  0.0001763353131*Math.pow(x,7)-0.004660305277*Math.pow(x,6)-0.004290746384*Math.pow(x,5)+0.06855725903*Math.pow(x,4)+
  0.03719817227*Math.pow(x,3)+0.4554696705*Math.pow(x,2)-0.08305450359*x+0.3020594956;
  };

  /*if it's above 6.8, but below the Move formula cut off (10 right now), then we have to use an additional formula because the current one
  //has a weird property where it goes sharply negative after 6.8 
  //I know this appears janky, but after messing with other potential regression formulas, I can't get any single one
  to match both the overall shape, and certainly specific Y values I want close enough. So this seems like best option.
  */
  if (x > 6.8 && x < 10) {
    return costFunc(6.8) + ((x-6.8) *3 );
  }else{
    return costFunc(x);
  }

};

var ascMoveFormula = function(noteD,fingD) {
  //this isn't necessarily just for ascending situations. It's really where the direction of notes and direction of fingers are opposite.
  //in either case, you want to add the distance between the fingers.

  //the Math.ceil part is for the somewhat janky nature of my moveHash, which only has integers right now. I could add in .5 spaces, and that should handle it
  var totalD = Math.ceil(noteD + fingD);

  //this adds a small amount for every additional halfstep over 24. Fairly representative of what it should be. 
  if (totalD > 24) {
    return moveHash[24] + ( (totalD - 24) / 5);
  }else {
    return moveHash[totalD];
  }
};

var descMoveFormula = function(noteD,fingD) {
  //this is for situations where direction of notes and fingers is the same. You want to subtract finger distance in that case.
  var totalD = Math.ceil(noteD - fingD);

  //this adds a small amount for every additional halfstep over 24. Fairly representative of what it should be. 
  if (totalD > 24) {
    return moveHash[24] + ( (totalD - 24) / 5);
  }else {
    return moveHash[totalD];
  }
};





var costAlgorithmRouter = function(n1,n2,f1,f2, costDatabase) {
  var key = n1.toString() + ',' + n2.toString() + ',' + f1.toString() + ',' + f2.toString();
  var noteD = Math.abs(n2-n1);
  var fingD = fingerDistance(f1,f2);



  //handles cases where the note is ascending or descending and you're using the same finger. That's move formula
  //it doesn't matter whether we send it to ascMoveFormula or descMoveFormula, since in either case, FingD is zero.
  if (Math.abs(n2 - n1) > 0 && f2-f1 === 0) {
    costDatabase[key] = ascMoveFormula(noteD,fingD);
  }
  //handles ascending notes and descending fingers, but f2 isn't thumb
  //means you're crossing over. Bad idea. Only plausible way to do this is picking your hand up. Thus move formula
  else if (n2 - n1 >= 0 && f2-f1 < 0 && f2 !== 1) {
    costDatabase[key] = ascMoveFormula(noteD,fingD);
  }
  //this handles descending notes with ascending fingers where f1 isn't thumb
  //means your crossing over. Same as above. Only plausible way is picking hand up, so move formula.
  else if (n2 - n1 < 0 && f2-f1 > 0 && f1 !== 1){
    costDatabase[key] = ascMoveFormula(noteD,fingD);
  }
  //this handles ascending notes, where you start on a finger that isn't your thumb, but you land on your thumb. 
  //Thus bringing your thumb under. 
  else if (n2 - n1 >= 0 && f2-f1 < 0 && f2 === 1) {
    costDatabase[key] = ascendingThumbCost(noteD,fingD,n1,n2,f1,f2);
  }
  //this handles descending notes, where you start on your thumb, but don't end with it. Thus your crossing over your thumb.
  else if (n2 - n1 < 0 && f1 === 1 && f2 !== 1) {
    costDatabase[key] = descendingThumbCost(noteD,fingD, f1,f2);
  }
  //this handles ascending or same note, with ascending or same finger
  //to be clear... only remaining options are (n2-n1 >= 0 && f2-f1 > 0 || n2-n1 <= 0 && f2-f1 < 0)
  else {
    var stretch = fingerStretch(f1,f2);
    var x = Math.abs(noteD - fingD) / stretch;
    if (x > 10) {
      costDatabase[key] = descMoveFormula(noteD, fingD);
    }else{
      costDatabase[key] = nonThumbCost(noteD,fingD,x);
    }
  }

};

var createCostDatabase;
module.exports.createCostDatabase = createCostDatabase = function() {
var costDatabase = {};
  for (var finger1 = 1; finger1 <=5; finger1++) {
    for (var note1 = 21; note1 < 109; note1++) {
      for (var finger2 = 1; finger2 <= 5; finger2++) {
        for (var note2 = 21; note2 < 109; note2++) {
          costAlgorithmRouter(note1, note2, finger1, finger2, costDatabase);
        }
      }
    }
  }
  // console.log(costDatabase);
  return costDatabase;
};



































