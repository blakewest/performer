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
  '1,1': 0
  '1,2': 2,    
  '1,3': 4,
  '1,4': 5,
  '1,5': 7,
  '2,1': 2,
  '2,2': 0,
  '2,3': 2,
  '2,4': 3.5,  // making an allowance since this seriously is either or 4 about half the time.
  '2,5': 5, 
  '3,1': 3.5 // same thing
  '3,2': 2,
  '3,3': 0,
  '3,4': 2,
  '3,5': 3.5,
  '4,1': 5
};

//this is fairly naive way of defining natural distance between two fingers.
//It assumes your on Middle C. Could potentially take into account n1 as a way to know how to handle the irregularities. Such as E-F being 1 half step, but G-A being 2.
var fingerDistance = function(f1,f2) {
  var key = f1.toString() + ',' + f2.toString();
  return fingDistance[key];
};

var costDatabase = {};

var dThumbStretch = {
  '1,2' : 1.1,
  '1,3' : 1,
  '1,4' : 0.9,
  '1,5' : 0.8
};

var aThumbStretch = {
  '1,2' : 0.9,
  '1,3' : 1,
  '1,4' : .95,
  '1,5' : 0.8
};

var fingStretch = {
  '2,3' : 0.9,
  '3,4' : 0.9,
  '4,5' : 0.8,
  '2,4' : 1.15,
  '3,5' : 1.15,
  '2,5' : 1.3,
  '1,2' : 1.15,
  '1,3' : 1.3,
  '1,4' : 1.45,
  '1,5' : 1.6
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
}

var nonThumbCost = function(n1,n2,f1,f2) {
  var noteD = Math.abs(n2-n1);
  var fingD = fingerDistance(f1,f2);
  var stretch = fingerStretch(f1,f2);

  var x = (noteD-fingD) / stretch;

  var y =-0.0000006589793725*Math.pow(x,10) -0.000002336381414*Math.pow(x,9) +0.00009925769823*Math.pow(x,8)+
  0.0001763353131*Math.pow(x,7)-0.004660305277*Math.pow(x,6)-0.004290746384*Math.pow(x,5)+0.06855725903*Math.pow(x,4)+
  0.03719817227*Math.pow(x,3)+0.4554696705*Math.pow(x,2)-0.08305450359*x+0.3020594956;

  return y;
};

var ascendingThumbCost = function(n1,n2,f1,f2) {
  var noteD = Math.abs(n2-n1);
  var fingD = fingerDistance(f1,f2);
  var stretch = ascendingThumbStretch(f1,f2);

  var x = (noteD - fingD) / stretch;

  var y =-0.0003112526902*Math.pow(x,7)+0.01885042991*Math.pow(x,6)-
  0.4641792923*Math.pow(x,5)+6.02919054*Math.pow(x,4)-44.66602087*Math.pow(x,3)+
  189.4583817*Math.pow(x,2)-427.7666473*x+400.1590843;

  if (color[n1%12] === 'White' && color[n2%12] === 'Black') {
    y += 8;
  }
  return y;
};

var descendingThumbCost = function(n1,n2,f1,f2) {
  var noteD = Math.abs(n2-n1);
  var fingD = fingerDistance(f1,f2);
  var stretch = descendingThumbStretch(f1,f2);

  var x = (noteD - fingD) / stretch;

  var y =-0.0003112526902*Math.pow(x,7)+0.01885042991*Math.pow(x,6)-
  0.4641792923*Math.pow(x,5)+6.02919054*Math.pow(x,4)-44.66602087*Math.pow(x,3)+
  189.4583817*Math.pow(x,2)-427.7666473*x+400.1590843;

  return y;

};


var walker = function() {
  for (var finger1 = 1; finger1 <=3; finger1++) {
    for (var note1 = 20; note1 < 25; note1++) {
      for (var finger2 = 1; finger2 <= 3; finger2++) {
        for (var note2 = 50; note2 < 55; note2++) {
          costAlgorithmRouter(note1, note2, finger1, finger2);
        }
      }
    }
  }
  console.log(costDatabase);
};

var moveFormula = function(n1,n2,f1,f2) {
  //add some fixed cost + a logarithmic function
};

var costAlgorithmRouter = function(n1,n2,f1,f2) {
  var key = n1.toString() + ',' + n2.toString() + ',' + f1.toString() + f2.toString();

  //this handles ascending or same note, with ascending or same finger
  if (n2 - n1 >= 0 && f2 - f1 >= 0) {
    costDatabase[key] = nonThumbCost(n1,n2,f1,f2);
  }
  //this handles descending notes, with descending fingers
  else if(n2 - n1 < 0 && f2 - f1 < 0) {
    costDatabase[key] = nonThumbCost(n1,n2,f1,f2);
  }
  //this handles ascending notes with descending finger, but f2 isn't thumb
  //means you're crossing over. Never a good idea, so return arbitrary high value. (general high value of cost functions is 16)
  else if (n2 - n1 > 0 && f2-f1 < 0 && f2 !== 1) {
    costDatabase[key] = 50;
  }
  //this handles descending notes with ascending fingers where f1 isn't thumb
  //means your crossing over. Really bad, so return arbitrary high value.
  else if (n2 - n1 < 0 && f2-f1 > 0 && f1 !== 1){
    costDatabase[key] = 50;
  }
  //if it hasn't been caught yet, then we must have to move, so use move formula
  else {
    costDatabase[key] = moveFormula(n1,n2,f1,f2);
  }
};



































