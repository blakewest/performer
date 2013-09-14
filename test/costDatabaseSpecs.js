var should = require('should');
var db = require('../src/Algorithms/CostAlgorithm.js');
var _ = require('underscore');

describe('cost database', function() {
  var costDb = db.createCostDatabase();
  describe('Database itself', function() {
    it('has a length of 193600', function() {
      should(Object.keys(costDb)).have.lengthOf(193600);
    });
    it('should have numbers for every value', function() {
      var anyNonNumbers = false;
      var whichNonNumbers = [];
      for (var each in costDb) {
        if (typeof costDb[each] !== 'number') {
          anyNonNumbers = true;
          whichNonNumbers.push(each);
        }
      }
      console.log(whichNonNumbers);
      anyNonNumbers.should.equal(false);
    });
  });
  describe('accuracy of ascending notes, not involving the thumb', function() {
    it('E,G with 3,5 should have lower cost than E,G with 3,2', function() {
      costDb['64,67,3,5'].should.be.below(costDb['64,67,3,2']);
    });
    // it('E,F,G,A with 3,1,2,3 should have lower cost than using 3,4,5,5', function() {

    // });
    // it('E,G,A with 2,4,5 should have lower cost than using 2,3,4', function() {

    // });

  });
});
