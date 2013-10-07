var params = require('./CostAlgorithmParameters.js')
var mod = module.exports;

// Got this crazy function from regressing values I wanted at about 15 points along the graph. 
var ThumbCrossCostFunc = function(x) {
 return 0.0002185873295*Math.pow(x,7) - 0.008611946279*Math.pow(x,6) + 0.1323250066*Math.pow(x,5) - 1.002729677*Math.pow(x,4)+
 3.884106308*Math.pow(x,3) - 6.723075747*Math.pow(x,2) + 1.581196785*x + 7.711241722;
};

var colorRules = function(n1,n2,f1,f2, fingD) {
  // If you're moving up from white to black with pinky or thumb, that's much harder than white-to-white would be. So we're adding some amount.
  if (params.color[n1%12] === 'White' && params.color[n2%12] === 'Black') {
    if (f2 === 5 || f2 === 1) {return 4;} // Using thumb or pinky on black is extra expensive
    if (fingD === 0) {return 4;} // Using same finger is extra expensive
  }
  if (params.color[n1%12] === 'Black' && params.color[n2%12] === 'White') {
    if (f1 === 5 || f1 === 1) {return 4;} // Moving from thumb or pinky that's already on black is extra expensive
    if (fingD === 0) {return -1;} // Moving black to white with same finger is a slide. That's easy and common. reduce slightly.
  }
  return 0; // If none of the rules apply, then don't add or subtract anything
};

var ascMoveFormula = mod.ascMoveFormula = function(noteD,fingD,n1,n2,f1,f2) {
  // This is for situations where direction of notes and fingers are opposite, because either way, you want to add the distance between the fingers.

  // The Math.ceil part is so it def hits a value in our moveHash. This could be fixed if I put more resolution into the moveHash
  var totalD = Math.ceil(noteD + fingD);
  var cost;

  // This adds a small amount for every additional halfstep over 24. Fairly representative of what it should be. 
  if (totalD > 24) {
    return params.moveHash[24] + ( (totalD - 24) / 5);
  }else {
    cost = params.moveHash[totalD];
    cost += colorRules(n1,n2,f1,f2,fingD);
    return cost;
  }
};

mod.descMoveFormula = function(noteD,fingD,n1,n2,f1,f2) {
  // This is for situations where direction of notes and fingers is the same. You want to subtract finger distance in that case.
  var totalD = Math.ceil(noteD - fingD);
  var cost;

  // This adds a small amount for every additional halfstep over 24. Fairly representative of what it should be. 
  if (totalD > 24) {
    return params.moveHash[24] + ( (totalD - 24) / 5);
  }else {
    cost = params.moveHash[totalD];
    cost += colorRules(n1,n2,f1,f2,fingD);
    return cost;
  }
};

// Currently assumes your on Middle C. Could potentially take into account n1 as a way to know how to handle the irregularities. Such as E-F being 1 half step, but G-A being 2.
mod.fingerDistance = function(f1,f2) {
  var key = f1.toString() + ',' + f2.toString();
  return params.fingDistance[key];
};

mod.ascThumbCost = function(noteD,fingD,n1,n2,f1,f2) {
  var stretch = ascThumbStretch(f1,f2);
  var x = (noteD + fingD) / stretch;

  // If it's over 10, again use the move formula
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

  /* If it's above 6.8, but below moveCutoff, then we use an additional formula because the current one
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



















