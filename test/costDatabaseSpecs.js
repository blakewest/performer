var should = require('should');
var db = require('../src/Algorithms/CostAlgorithm.js');
var _ = require('underscore');

describe('cost database itself', function() {
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
      anyNonNumbers.should.equal(false);
    });
  });

  describe('accuracy of ascending or same notes, not involving the thumb', function() {
    it('E,G with 3,5 should have lower cost than E,G with 3,2', function() {
      costDb['64,67,3,5'].should.be.below(costDb['64,67,3,2']);
    });
    it('E,G with 2,3 should have lower cost than E,G with 2,2', function() {
      costDb['64,67,2,3'].should.be.below(costDb['64,67,2,2']);
    });
    it('E,G with 3,5 should have lower cost than E,G with 3,2', function() {
      costDb['64,67,4,5'].should.be.below(costDb['64,67,4,4']);
    });
    it('E,E with 3,3 should have lower cost than E,E with 3,2', function() {
      costDb['64,64,3,3'].should.be.below(costDb['64,64,3,2']);
    });
    it('E,E with 4,4 should have lower cost than E,E with 4,5', function() {
      costDb['64,64,4,4'].should.be.below(costDb['64,64,4,5']);
    });
   
    it('E,F,G,A with 2,3,4,5 should have lower cost than using 2,2,3,4', function() {
      var correctStep1= costDb['64,65,2,3'];
      var correctStep2 = costDb['65,67,3,4'];
      var correctStep3 = costDb['67,69,4,5'];
      var wrongStep1 = costDb['64,65,2,2'];
      var wrongStep2 = costDb['65,67,2,3'];
      var wrongStep3 = costDb['67,69,3,4'];
      var wrongPath = wrongStep1 + wrongStep2 + wrongStep3;
      var correctPath = correctStep1 + correctStep2 + correctStep3;

      correctPath.should.be.below(wrongPath);
    });
    it('E,G,A with 2,4,5 should have lower cost than using 2,3,4', function() {
      var correctStep1= costDb['64,67,2,4'];
      var correctStep2 = costDb['67,69,4,5'];
      var wrongStep1 = costDb['64,67,2,3'];
      var wrongStep2 = costDb['67,69,3,4'];
      var wrongPath = wrongStep1 + wrongStep2;
      var correctPath = correctStep1 + correctStep2;

      correctPath.should.be.below(wrongPath);
    });
  });

  describe('accuracy of ascending or same notes involving crossing under thumb', function() {
     it('E,F,G,A with 3,1,2,3 should have lower cost than using 3,4,5,5', function() {
        var correctStep1= costDb['64,65,3,1'];
        var correctStep2 = costDb['65,67,1,2'];
        var correctStep3 = costDb['67,69,2,3'];
        var wrongStep1 = costDb['64,65,3,4'];
        var wrongStep2 = costDb['65,67,4,5'];
        var wrongStep3 = costDb['67,69,5,5'];
        var wrongPath = wrongStep1 + wrongStep2 + wrongStep3;
        var correctPath = correctStep1 + correctStep2 + correctStep3;

        correctPath.should.be.below(wrongPath);
      });
     it('E,F,G,A with 3,1,2,3 should have lower cost than using 3,1,3,4', function() {
        var correctStep1= costDb['64,65,3,1'];
        var correctStep2 = costDb['65,67,1,2'];
        var correctStep3 = costDb['67,69,2,3'];
        var wrongStep1 = costDb['64,65,3,1'];
        var wrongStep2 = costDb['65,67,1,3'];
        var wrongStep3 = costDb['67,69,3,4'];
        var wrongPath = wrongStep1 + wrongStep2 + wrongStep3;
        var correctPath = correctStep1 + correctStep2 + correctStep3;

        correctPath.should.be.below(wrongPath);
      });
   });

  describe('ascending notes involving thumb, but not crossing under', function() {
    it('C,F,G,A with 1,3,4,5 should have lower cost than using 1,4,5,5', function() {
      var correctStep1= costDb['60,65,1,3'];
      var correctStep2 = costDb['65,67,3,4'];
      var correctStep3 = costDb['67,69,4,5'];
      var wrongStep1 = costDb['60,65,1,4'];
      var wrongStep2 = costDb['65,67,4,5'];
      var wrongStep3 = costDb['67,69,5,5'];
      var wrongPath = wrongStep1 + wrongStep2 + wrongStep3;
      var correctPath = correctStep1 + correctStep2 + correctStep3;

      correctPath.should.be.below(wrongPath);
    });

    it('C,G with 1,5 should have lower cost than using 1,4', function() {
      var correctStep1= costDb['60,67,1,5'];
      var wrongStep1 = costDb['60,67,1,4'];
      var wrongPath = wrongStep1;
      var correctPath = correctStep1;

      correctPath.should.be.below(wrongPath);
    });
    it('C,high C, high C with 1,5,5 should have lower cost than using 1,5,4', function() {
      var correctStep1= costDb['60,72,1,5'];
      var correctStep2 = costDb['72,72,5,5'];
      var wrongStep1 = costDb['60,72,1,5'];
      var wrongStep2 = costDb['72,72,5,4'];
      var wrongPath = wrongStep1 + wrongStep2;
      var correctPath = correctStep1 + correctStep2;

      correctPath.should.be.below(wrongPath);
    });
  });

  describe('descending notes involving crossing over thumb', function() {
    it('C down to B with 1,2 should have lower cost than using 1,3', function() {
      var correctStep1= costDb['60,59,1,2'];
      var wrongStep1 = costDb['60,72,1,3'];
      var wrongPath = wrongStep1;
      var correctPath = correctStep1;

      correctPath.should.be.below(wrongPath);
    });
  });
});


























