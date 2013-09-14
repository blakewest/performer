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
      var NotaNumbers = [];
      for (var each in costDb) {
        if (typeof costDb[each] !== 'number' || isNaN(costDb[each])) {
          anyNonNumbers = true;
          if (isNaN(costDb[each])) {
            NotaNumbers.push(each);
          }
        }
      }
      console.log(NotaNumbers);
      anyNonNumbers.should.equal(false);
    });
  });
  describe('accuracy of ascending notes, not involving the thumb', function() {
    it('E,G with 3,5 should have lower cost than E,G with 3,2', function() {
      costDb['64,67,3,5'].should.be.below(costDb['64,67,3,2']);
    });
    it('E,F,G,A with 3,1,2,3 should have lower cost than using 3,4,5,5', function() {
      var wrongPath = costDb['64,65,3,4'] + costDb['65,67,4,5'] + costDb['67,69,5,5'];
      var correctPath = costDb['64,65,3,1'] + costDb['65,67,1,2'] + costDb['67,69,2,3'];
      console.log(costDb['64,65,3,1']);
      correctPath.should.be.below(wrongPath);
    });
    // it('E,G,A with 2,4,5 should have lower cost than using 2,3,4', function() {

    // });

  });
});
