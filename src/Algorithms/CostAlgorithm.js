var costAlgorithm = function(n1,n2,f1,f2) {

};

var nonThumbCost = function(n1,n2,f1,f2) {
  var noteD = n2-n1;
  var fingD = fingerDistance(f1,f2);
  var stretch = fingerStretch(f1,f2);

  var x = (noteD-fingD) / stretch;

  var y =-0.0000006589793725*Math.pow(x,10) -0.000002336381414*Math.pow(x,9) +0.00009925769823*Math.pow(x,8)+
  0.0001763353131*Math.pow(x,7)-0.004660305277*Math.pow(x,6)-0.004290746384*Math.pow(x,5)+0.06855725903*Math.pow(x,4)
  +0.03719817227*Math.pow(x,3)+0.4554696705*Math.pow(x,2)-0.08305450359*x+0
  .3020594956;

  return y;
};

var ascendingThumbCost = function(n1,n2,f1,f2) {
  var noteD = n2 - n1;
  var fingD = fingerDistance(f1,f2);
  var stretch = ascendingThumbStretch(f1,f2);

  var x = (noteD - fingD) / stretch;

  var y =-0.0003112526902*Math.pow(x,7)+0.01885042991*Math.pow(x,6)
  -0.4641792923*Math.pow(x,5)+6.02919054*Math.pow(x,4)-44.66602087*Math.pow(x,3)
  +189.4583817*Math.pow(x,2)-427.7666473*x+400.1590843;

  if (n1.color === 'white' && n2.color === 'black') {
    y += 8;
  }
  return y;
};

var descendingThumbCost = function(n1,n2,f1,f2) {
  var noteD = n2 - n1;
  var fingD = fingerDistance(f1,f2);
  var stretch = descendingThumbStretch(f1,f2);
};
































