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
mod.moveHash = makeMoveHash(3);

mod.descThumbStretchVals = {
  '1,2' : 1,
  '1,3' : 1,
  '1,4' : 0.9,
  '1,5' : 0.8
};

mod.ascThumbStretchVals = {
  '2,1' : 0.95,
  '3,1' : 1,
  '4,1' : 0.95,
  '5,1' : 0.8
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
  '4,5' : 0.8,
  '5,1' : 1.6,
  '5,2' : 1.3,
  '5,3' : 1.15,
  '5,4' : 0.8,
  '5,5' : 0.7
};
