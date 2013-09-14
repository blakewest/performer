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
      var result = _reduce(costDb, function(memo, value) {
        if (value);
      })
    })
  });
  describe('accuracy of ascending notes, not involving the thumb', function() {
    it('E,G with 3,5 should have lower cost than E,G with 3,1', function() {
      
    })
    it('E,F,G,A with 3,1,2,3 should have lower cost than using 3,4,5,5', function() {

    });
    it('E,G,A with 2,4,5 should have lower cost than using 2,3,4', function() {
      
    })

  })
});
