var should = require('should');
var db = require('../src/Algorithms/CostAlgorithm.js');
var _ = require('underscore');

describe('|cost database|', function() {
  var costDb = db.createCostDatabase();
  describe('|Database itself|', function() {
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
    it('should have positive values for every value', function() {
      var anyNegativeNumbers = false;
      var negativeNumbers = [];
      for (var each in costDb) {
        if (costDb[each] < 0) {
          anyNegativeNumbers = true;
          negativeNumbers.push(each);
        }
      }
      console.log(negativeNumbers);
      anyNegativeNumbers.should.equal(false);
    });
  });

  describe('|accuracy of ascending or same notes, not involving the thumb|', function() {
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

  describe('|accuracy of ascending or same notes involving crossing under thumb|', function() {
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
     it('A,B,C,G with 1,2,1,5 should have lower cost than using 1,2,3,5', function() {
        var correctStep1= costDb['57,59,1,2'];
        var correctStep2 = costDb['59,60,2,1'];
        var correctStep3 = costDb['60,67,1,5'];
        var wrongStep1= costDb['57,59,1,2'];
        var wrongStep2 = costDb['59,60,2,3'];
        var wrongStep3 = costDb['60,67,3,5'];
        var wrongPath = wrongStep1 + wrongStep2 + wrongStep3;
        var correctPath = correctStep1 + correctStep2 + correctStep3;

        correctPath.should.be.below(wrongPath);
      });
   });

  describe('|ascending notes involving thumb, but not crossing under|', function() {
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
    it('C, up to A, then High C, with 1, 3, 5, should have lower cost than 1,5,5,', function() {
      var correctStep1= costDb['60,69,1,3'];
      var correctStep2 = costDb['69,72,3,5'];
      var wrongStep1 = costDb['60,69,1,5'];
      var wrongStep2 = costDb['69,72,5,5'];
      var wrongPath = wrongStep1 + wrongStep2;
      var correctPath = correctStep1 + correctStep2;

      console.log('correctStep1: ', correctStep1);
      console.log('correctStep2: ', correctStep2);
      console.log('wrongStep1: ', wrongStep1);
      console.log('wrongStep2: ', wrongStep2);

      correctPath.should.be.below(wrongPath);
    });
  });

  describe('|descending notes involving crossing over thumb|', function() {
    it('C down to B with 1,2 should have lower cost than using 1,3', function() {
      var correctStep1= costDb['60,59,1,2'];
      var wrongStep1 = costDb['60,59,1,3'];
      var wrongPath = wrongStep1;
      var correctPath = correctStep1;

      correctPath.should.be.below(wrongPath);
    });
    it('C down to B with 1,2 should have lower cost than using 1,4', function() {
      var correctStep1= costDb['60,59,1,2'];
      var wrongStep1 = costDb['60,59,1,4'];
      var wrongPath = wrongStep1;
      var correctPath = correctStep1;

      correctPath.should.be.below(wrongPath);
    });
    it('C down to B with 1,2 should have lower cost than using 1,5', function() {
      var correctStep1= costDb['60,59,1,2'];
      var wrongStep1 = costDb['60,59,1,5'];
      var wrongPath = wrongStep1;
      var correctPath = correctStep1;

      correctPath.should.be.below(wrongPath);
    });
    it('C down to B with 1,3 should have lower cost than using 1,4', function() {
      var correctStep1= costDb['60,59,1,3'];
      var wrongStep1 = costDb['60,59,1,4'];
      var wrongPath = wrongStep1;
      var correctPath = correctStep1;

      correctPath.should.be.below(wrongPath);
    });
    it('C down to B with 1,3 should have lower cost than using 1,5', function() {
      var correctStep1= costDb['60,59,1,3'];
      var wrongStep1 = costDb['60,59,1,5'];
      var wrongPath = wrongStep1;
      var correctPath = correctStep1;

      correctPath.should.be.below(wrongPath);
    });
    xit('C,B,A with 1,3,2 should have lower cost than using 1,2,1', function() {
      var correctStep1= costDb['60,59,1,3'];
      var correctStep2 = costDb['59,57,3,2'];
      var wrongStep1 = costDb['60,59,1,2'];
      var wrongStep2 = costDb['59,57,2,1'];
      var wrongPath = wrongStep1 + wrongStep2;
      var correctPath = correctStep1 + correctStep2;

      console.log('wrongStep1 = ', wrongStep1);
      console.log('wrongStep2 = ', wrongStep2);
      console.log('correctStep1 = ', correctStep1);
      console.log('correctStep2 = ', correctStep2);

      console.log('wrong path = ', wrongPath);
      console.log('correctPath = ', correctPath);

      correctPath.should.be.below(wrongPath);
    });
  });
  describe('|ascending and descending notes, not involving thumb|', function() {
    it ('E up A down G with 2,5,4 should have lower cost than using 2,5,3', function() {
      var correctStep1= costDb['64,69,2,5'];
      var correctStep2 = costDb['69,67,5,4'];
      var wrongStep1 = costDb['64,69,2,5'];
      var wrongStep2 = costDb['69,67,5,3'];
      var wrongPath = wrongStep1 + wrongStep2;
      var correctPath = correctStep1 + correctStep2;

      correctPath.should.be.below(wrongPath);
    });
    it ('E up high E down D with 2,5,4 should have lower cost than using 2,4,3', function() {
      var correctStep1= costDb['64,76,2,5'];
      var correctStep2 = costDb['76,74,5,4'];
      var wrongStep1 = costDb['64,76,2,4'];
      var wrongStep2 = costDb['69,67,4,3'];
      var wrongPath = wrongStep1 + wrongStep2;
      var correctPath = correctStep1 + correctStep2;

      correctPath.should.be.below(wrongPath);
    });
    it ('F down D up F with 3,2,4 should have lower cost than using 3,2,5', function() {
      var correctStep1= costDb['65,62,3,2'];
      var correctStep2 = costDb['62,65,2,4'];
      var wrongStep1 = costDb['65,62,3,2'];
      var wrongStep2 = costDb['62,65,2,5'];
      var wrongPath = wrongStep1 + wrongStep2;
      var correctPath = correctStep1 + correctStep2;

      correctPath.should.be.below(wrongPath);
    });
  });
  describe('|ascending and descending with thumb|', function() {
    it ('D down C down B up C with 2,1,2,1 should have lower cost than using 2,1,1,1', function() {
      var correctStep1= costDb['62,60,2,1'];
      var correctStep2 = costDb['60,59,1,2'];
      var correctStep3 = costDb['59,60,2,1'];
      var wrongStep1 = costDb['62,60,2,1'];
      var wrongStep2 = costDb['60,59,1,1'];
      var wrongStep3 = costDb['59,60,1,1'];

      var wrongPath = wrongStep1 + wrongStep2 + wrongStep3;
      var correctPath = correctStep1 + correctStep2 + correctStep3;

      correctPath.should.be.below(wrongPath);
    });
    it ('C down A up C with 1,2,1 should be lower cost than 1,1,1', function() {
      var correctStep1= costDb['60,57,1,2'];
      var correctStep2 = costDb['57,60,2,1'];
      var wrongStep1= costDb['60,57,1,1'];
      var wrongStep2 = costDb['57,60,1,1'];

      var wrongPath = wrongStep1 + wrongStep2;
      var correctPath = correctStep1 + correctStep2;

      correctPath.should.be.below(wrongPath);
    });
  });
  describe('|testing scale fingerings|', function() {
    it ('C major ascending scale with 1,2,3,1,2,3,4,5 should be lower cost than 1,2,3,4,1,2,3', function() {
      var correctStep1= costDb['60,62,1,2'];
      var correctStep2 = costDb['62,64,2,3'];
      var correctStep3 = costDb['64,65,3,1'];
      var correctStep4 = costDb['65,67,1,2'];
      var correctStep5 = costDb['67,69,2,3'];
      var correctStep6 = costDb['69,71,3,4'];
      var correctStep7 = costDb['71,72,4,5'];

      var wrongStep1 = costDb['60,62,1,2'];
      var wrongStep2 = costDb['62,64,2,3'];
      var wrongStep3 = costDb['64,65,3,4'];
      var wrongStep4 = costDb['65,67,4,1'];
      var wrongStep5 = costDb['67,69,1,2'];
      var wrongStep6 = costDb['69,71,2,3'];
      var wrongStep7 = costDb['71,72,3,4'];

      var wrongPath = wrongStep1 + wrongStep2 + wrongStep3 + wrongStep4 + wrongStep5 + wrongStep6 + wrongStep7;
      var correctPath = correctStep1 + correctStep2 + correctStep3 + correctStep4 + correctStep5 + correctStep6 + correctStep7;

      correctPath.should.be.below(wrongPath);
    });
    it ('C major descending scale with 5,4,3,2,1,3,2,1 should be lower cost than 5,4,3,2,1,4,3,2', function() {
      var correctStep1= costDb['72,71,5,4'];
      var correctStep2 = costDb['71,69,4,3'];
      var correctStep3 = costDb['69,67,3,2'];
      var correctStep4 = costDb['67,65,2,1'];
      var correctStep5 = costDb['65,64,1,3'];
      var correctStep6 = costDb['64,62,3,2'];
      var correctStep7 = costDb['62,60,2,1'];

      var wrongStep1= costDb['72,71,5,4'];
      var wrongStep2 = costDb['71,69,4,3'];
      var wrongStep3 = costDb['69,67,3,2'];
      var wrongStep4 = costDb['67,65,2,1'];
      var wrongStep5 = costDb['65,64,1,4'];
      var wrongStep6 = costDb['64,62,4,3'];
      var wrongStep7 = costDb['62,60,3,2'];

      var wrongPath = wrongStep1 + wrongStep2 + wrongStep3 + wrongStep4 + wrongStep5 + wrongStep6 + wrongStep7;
      var correctPath = correctStep1 + correctStep2 + correctStep3 + correctStep4 + correctStep5 + correctStep6 + correctStep7;

      correctPath.should.be.below(wrongPath);
    });
    it ('F major ascending scale with 1,2,3,4,1,2,3,4 should be lower cost than 1,2,3,1,2,3,4', function() {
      var correctStep1= costDb['65,67,1,2'];
      var correctStep2 = costDb['67,69,2,3'];
      var correctStep3 = costDb['69,70,3,4'];
      var correctStep4 = costDb['70,72,4,1'];
      var correctStep5 = costDb['72,74,1,2'];
      var correctStep6 = costDb['74,76,2,3'];
      var correctStep7 = costDb['76,77,3,4'];

      var wrongStep1= costDb['65,67,1,2'];
      var wrongStep2 = costDb['67,69,2,3'];
      var wrongStep3 = costDb['69,70,3,1'];
      var wrongStep4 = costDb['70,72,1,2'];
      var wrongStep5 = costDb['72,74,2,3'];
      var wrongStep6 = costDb['74,76,3,4'];
      var wrongStep7 = costDb['76,77,4,5'];

      var wrongPath = wrongStep1 + wrongStep2 + wrongStep3 + wrongStep4 + wrongStep5 + wrongStep6 + wrongStep7;
      var correctPath = correctStep1 + correctStep2 + correctStep3 + correctStep4 + correctStep5 + correctStep6 + correctStep7;

      correctPath.should.be.below(wrongPath);
    });
    it ('F major descending scale with 4,3,2,1,4,3,2,1 should be lower cost than 5,4,3,2,1,3,2,1', function() {
      var correctStep1= costDb['77,76,4,3'];
      var correctStep2 = costDb['76,74,3,2'];
      var correctStep3 = costDb['74,72,2,1'];
      var correctStep4 = costDb['72,70,1,4'];
      var correctStep5 = costDb['70,69,4,3'];
      var correctStep6 = costDb['69,67,3,2'];
      var correctStep7 = costDb['67,65,2,1'];

      var wrongStep1= costDb['77,76,5,4'];
      var wrongStep2 = costDb['76,74,4,3'];
      var wrongStep3 = costDb['74,72,3,2'];
      var wrongStep4 = costDb['72,70,2,1'];
      var wrongStep5 = costDb['70,69,1,3'];
      var wrongStep6 = costDb['69,67,3,2'];
      var wrongStep7 = costDb['67,65,2,1'];

      var wrongPath = wrongStep1 + wrongStep2 + wrongStep3 + wrongStep4 + wrongStep5 + wrongStep6 + wrongStep7;
      var correctPath = correctStep1 + correctStep2 + correctStep3 + correctStep4 + correctStep5 + correctStep6 + correctStep7;

      correctPath.should.be.below(wrongPath);
    });
  });
});


























