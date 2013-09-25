var should = require('should');
var db = require('../src/Algorithms/LHCostAlgorithm.js');
var _ = require('underscore');

describe('|LH cost database|', function() {
  var costDb = db.createLHCostDatabase();
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
    it('E,G with 4,2 should have lower cost than E,G with 4,3', function() {
      costDb['64,67,4,2'].should.be.below(costDb['64,67,4,3']);
    });
    it('E,G with 3,2 should have lower cost than E,G with 2,2', function() {
      costDb['64,67,3,2'].should.be.below(costDb['64,67,2,2']);
    });
    it('E,G with 5,3 should have lower cost than E,G with 5,2', function() {
      costDb['64,67,5,3'].should.be.below(costDb['64,67,5,2']);
    });
    it('E,E with 3,3 should have lower cost than E,E with 3,2', function() {
      costDb['64,64,3,3'].should.be.below(costDb['64,64,3,2']);
    });
    it('E,E with 4,4 should have lower cost than E,E with 4,5', function() {
      costDb['64,64,4,4'].should.be.below(costDb['64,64,4,5']);
    });
   
    it('E,F,G,A with 5,4,3,2 should have lower cost than using 5,3,2,1', function() {
      var correctStep1= costDb['64,65,5,4'];
      var correctStep2 = costDb['65,67,4,3'];
      var correctStep3 = costDb['67,69,3,2'];
      var wrongStep1 = costDb['64,65,5,3'];
      var wrongStep2 = costDb['65,67,3,2'];
      var wrongStep3 = costDb['67,69,2,1'];
      var wrongPath = wrongStep1 + wrongStep2 + wrongStep3;
      var correctPath = correctStep1 + correctStep2 + correctStep3;

      correctPath.should.be.below(wrongPath);
    });
    it('E,G,A with 5,3,2 should have lower cost than using 5,4,3', function() {
      var correctStep1= costDb['64,67,5,3'];
      var correctStep2 = costDb['67,69,3,2'];
      var wrongStep1 = costDb['64,67,5,4'];
      var wrongStep2 = costDb['67,69,4,3'];
      var wrongPath = wrongStep1 + wrongStep2;
      var correctPath = correctStep1 + correctStep2;

      correctPath.should.be.below(wrongPath);
    });
  });

  describe('|accuracy of descending or same notes involving crossing under thumb|', function() {
     it('A,G,F,E with 3,1,2,3 should have lower cost than using 3,4,5,5', function() {
        var correctStep1= costDb['69,67,3,1'];
        var correctStep2 = costDb['67,65,1,2'];
        var correctStep3 = costDb['65,64,2,3'];
        var wrongStep1 = costDb['69,67,3,4'];
        var wrongStep2 = costDb['67,65,4,5'];
        var wrongStep3 = costDb['65,64,5,5'];
        var wrongPath = wrongStep1 + wrongStep2 + wrongStep3;
        var correctPath = correctStep1 + correctStep2 + correctStep3;

        correctPath.should.be.below(wrongPath);
      });
     it('A,G,F,E with 3,1,2,3 should have lower cost than using 3,1,3,4', function() {
        var correctStep1= costDb['69,67,3,1'];
        var correctStep2 = costDb['67,65,1,2'];
        var correctStep3 = costDb['65,64,2,3'];
        var wrongStep1 = costDb['69,67,3,1'];
        var wrongStep2 = costDb['67,65,1,3'];
        var wrongStep3 = costDb['65,64,3,4'];
        var wrongPath = wrongStep1 + wrongStep2 + wrongStep3;
        var correctPath = correctStep1 + correctStep2 + correctStep3;

        correctPath.should.be.below(wrongPath);
      });
     it('G,F,E,A with 1,2,1,5 should have lower cost than using 1,2,3,5', function() {
        var correctStep1= costDb['67,65,1,2'];
        var correctStep2 = costDb['65,64,2,1'];
        var correctStep3 = costDb['64,57,1,5'];
        var wrongStep1= costDb['67,65,1,2'];
        var wrongStep2 = costDb['65,64,2,3'];
        var wrongStep3 = costDb['64,57,3,5'];
        var wrongPath = wrongStep1 + wrongStep2 + wrongStep3;
        var correctPath = correctStep1 + correctStep2 + correctStep3;

        correctPath.should.be.below(wrongPath);
      });
     it('D,C#,C with 1,2,1 should have lower cost than using 1,1,1', function() {
        var correctStep1= costDb['62,61,1,2'];
        var correctStep2 = costDb['61,60,2,1'];
        var wrongStep1= costDb['62,61,1,1'];
        var wrongStep2 = costDb['61,60,1,1'];
        var wrongPath = wrongStep1 + wrongStep2;
        var correctPath = correctStep1 + correctStep2;

        correctPath.should.be.below(wrongPath);
      });
   });

  describe('|descending notes involving thumb, but not crossing under|', function() {
    it('C,G,F,E with 1,3,4,5 should have lower cost than using 1,4,5,5', function() {
      var correctStep1= costDb['60,55,1,3'];
      var correctStep2 = costDb['55,53,3,4'];
      var correctStep3 = costDb['53,52,4,5'];
      var wrongStep1 = costDb['60,55,1,4'];
      var wrongStep2 = costDb['55,53,4,5'];
      var wrongStep3 = costDb['53,52,5,5'];
      var wrongPath = wrongStep1 + wrongStep2 + wrongStep3;
      var correctPath = correctStep1 + correctStep2 + correctStep3;

      correctPath.should.be.below(wrongPath);
    });

    it('C,F with 1,5 should have lower cost than using 1,4', function() {
      var correctStep1= costDb['60,53,1,5'];
      var wrongStep1 = costDb['60,53,1,4'];
      var wrongPath = wrongStep1;
      var correctPath = correctStep1;

      correctPath.should.be.below(wrongPath);
    });
    it('C, low C, low C with 1,5,5 should have lower cost than using 1,5,4', function() {
      var correctStep1= costDb['60,48,1,5'];
      var correctStep2 = costDb['48,48,5,5'];
      var wrongStep1 = costDb['60,48,1,5'];
      var wrongStep2 = costDb['48,48,5,4'];
      var wrongPath = wrongStep1 + wrongStep2;
      var correctPath = correctStep1 + correctStep2;

      correctPath.should.be.below(wrongPath);
    });
    it('C, E, E, D, Db, C, E with 1, 5, 1, 2, 3, 3, 1 should have lower cost than 1,5,5,4,5,5,3', function() {
      var correctStep6= costDb['72,64,1,5'];
      var correctStep1= costDb['64,64,5,1'];
      var correctStep2 = costDb['64,62,1,2'];
      var correctStep3 = costDb['62,61,2,3'];
      var correctStep4 = costDb['61,60,3,3'];
      var correctStep5 = costDb['60,64,3,1'];

      var wrongStep6= costDb['72,64,1,5'];
      var wrongStep1= costDb['64,64,5,5'];
      var wrongStep2 = costDb['64,62,5,4'];
      var wrongStep3 = costDb['62,61,4,5'];
      var wrongStep4 = costDb['61,60,5,5'];
      var wrongStep5 = costDb['60,64,5,3'];
      var wrongPath = wrongStep1 + wrongStep2 + wrongStep3 + wrongStep4 + wrongStep5 + wrongStep6
      var correctPath = correctStep1 + correctStep2 + correctStep3 + correctStep4 + correctStep5 + correctStep6 ;

      correctPath.should.be.below(wrongPath);
    });
  });

  describe('|ascending notes involving crossing over thumb|', function() {
    it('C up to D with 1,2 should have lower cost than using 1,3', function() {
      var correctStep1= costDb['60,62,1,2'];
      var wrongStep1 = costDb['60,62,1,3'];
      var wrongPath = wrongStep1;
      var correctPath = correctStep1;

      correctPath.should.be.below(wrongPath);
    });
    it('C up to D with 1,2 should ha lower cost than using 1,4', function() {
      var correctStep1= costDb['60,62,1,2'];
      var wrongStep1 = costDb['60,62,1,4'];
      var wrongPath = wrongStep1;
      var correctPath = correctStep1;

      correctPath.should.be.below(wrongPath);
    });
    it('C up to D with 1,2 should have lower cost than using 1,5', function() {
      var correctStep1= costDb['60,62,1,2'];
      var wrongStep1 = costDb['60,62,1,5'];
      var wrongPath = wrongStep1;
      var correctPath = correctStep1;

      correctPath.should.be.below(wrongPath);
    });
    it('C down to B with 1,3 should have lower cost than using 1,4', function() {
      var correctStep1= costDb['60,62,1,3'];
      var wrongStep1 = costDb['60,62,1,4'];
      var wrongPath = wrongStep1;
      var correctPath = correctStep1;

      correctPath.should.be.below(wrongPath);
    });
    it('C up to D with 1,3 should have lower cost than using 1,5', function() {
      var correctStep1= costDb['60,62,1,3'];
      var wrongStep1 = costDb['60,62,1,5'];
      var wrongPath = wrongStep1;
      var correctPath = correctStep1;

      correctPath.should.be.below(wrongPath);
    });
    xit('C,D,E with 1,3,2 should have lower cost than using 1,2,1', function() {
      var correctStep1= costDb['60,62,1,3'];
      var correctStep2 = costDb['62,64,3,2'];
      var wrongStep1 = costDb['60,62,1,2'];
      var wrongStep2 = costDb['62,64,2,1'];
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
    it ('A up E down F with 2,5,4 should have lower cost than using 2,5,3', function() {
      var correctStep1= costDb['69,64,2,5'];
      var correctStep2 = costDb['64,65,5,4'];
      var wrongStep1 = costDb['69,64,2,5'];
      var wrongStep2 = costDb['64,65,5,3'];
      var wrongPath = wrongStep1 + wrongStep2;
      var correctPath = correctStep1 + correctStep2;

      correctPath.should.be.below(wrongPath);
    });
    it ('F down low F up G with 2,5,4 should have lower cost than using 2,4,3', function() {
      var correctStep1= costDb['65,53,2,5'];
      var correctStep2 = costDb['53,55,5,4'];
      var wrongStep1 = costDb['65,53,2,4'];
      var wrongStep2 = costDb['53,55,4,3'];
      var wrongPath = wrongStep1 + wrongStep2;
      var correctPath = correctStep1 + correctStep2;

      correctPath.should.be.below(wrongPath);
    });
    it ('D up F down D with 3,2,4 should have lower cost than using 3,2,5', function() {
      var correctStep1= costDb['62,65,3,2'];
      var correctStep2 = costDb['65,62,2,4'];
      var wrongStep1 = costDb['62,65,3,2'];
      var wrongStep2 = costDb['65,62,2,5'];
      var wrongPath = wrongStep1 + wrongStep2;
      var correctPath = correctStep1 + correctStep2;

      correctPath.should.be.below(wrongPath);
    });
  });
  describe('|ascending and descending with thumb|', function() {
    it ('D up E up F down E with 2,1,2,1 should have lower cost than using 2,1,1,1', function() {
      var correctStep1= costDb['62,64,2,1'];
      var correctStep2 = costDb['64,65,1,2'];
      var correctStep3 = costDb['65,64,2,1'];
      var wrongStep1 = costDb['62,64,2,1'];
      var wrongStep2 = costDb['64,65,1,1'];
      var wrongStep3 = costDb['65,64,1,1'];

      var wrongPath = wrongStep1 + wrongStep2 + wrongStep3;
      var correctPath = correctStep1 + correctStep2 + correctStep3;

      correctPath.should.be.below(wrongPath);
    });
    it ('A up C down A with 1,2,1 should be lower cost than 1,1,1', function() {
      var correctStep1= costDb['57,60,1,2'];
      var correctStep2 = costDb['60,57,2,1'];
      var wrongStep1= costDb['60,57,1,1'];
      var wrongStep2 = costDb['57,60,1,1'];

      var wrongPath = wrongStep1 + wrongStep2;
      var correctPath = correctStep1 + correctStep2;

      correctPath.should.be.below(wrongPath);
    });
  });
  describe('|testing scale fingerings|', function() {
    it ('C major ascending scale with 5,4,3,2,1,3,2,1 should be lower cost than 5,4,3,2,1,4,3,2', function() {
      var correctStep1= costDb['60,62,5,4'];
      var correctStep2 = costDb['62,64,4,3'];
      var correctStep3 = costDb['64,65,3,2'];
      var correctStep4 = costDb['65,67,2,1'];
      var correctStep5 = costDb['67,69,1,3'];
      var correctStep6 = costDb['69,71,3,2'];
      var correctStep7 = costDb['71,72,2,1'];

      var wrongStep1 = costDb['60,62,5,4'];
      var wrongStep2 = costDb['62,64,4,3'];
      var wrongStep3 = costDb['64,65,3,2'];
      var wrongStep4 = costDb['65,67,2,1'];
      var wrongStep5 = costDb['67,69,1,4'];
      var wrongStep6 = costDb['69,71,4,3'];
      var wrongStep7 = costDb['71,72,3,2'];

      var wrongPath = wrongStep1 + wrongStep2 + wrongStep3 + wrongStep4 + wrongStep5 + wrongStep6 + wrongStep7;
      var correctPath = correctStep1 + correctStep2 + correctStep3 + correctStep4 + correctStep5 + correctStep6 + correctStep7;

      correctPath.should.be.below(wrongPath);
    });
    it ('C major descending scale with 1,2,3,1,2,3,4,5 should be lower cost than 1,2,3,4,1,2,3', function() {
      var correctStep1= costDb['72,71,1,2'];
      var correctStep2 = costDb['71,69,2,3'];
      var correctStep3 = costDb['69,67,3,1'];
      var correctStep4 = costDb['67,65,1,2'];
      var correctStep5 = costDb['65,64,2,3'];
      var correctStep6 = costDb['64,62,3,4'];
      var correctStep7 = costDb['62,60,4,5'];

      var wrongStep1= costDb['72,71,1,2'];
      var wrongStep2 = costDb['71,69,2,3'];
      var wrongStep3 = costDb['69,67,3,4'];
      var wrongStep4 = costDb['67,65,4,1'];
      var wrongStep5 = costDb['65,64,1,2'];
      var wrongStep6 = costDb['64,62,2,3'];
      var wrongStep7 = costDb['62,60,3,4'];

      var wrongPath = wrongStep1 + wrongStep2 + wrongStep3 + wrongStep4 + wrongStep5 + wrongStep6 + wrongStep7;
      var correctPath = correctStep1 + correctStep2 + correctStep3 + correctStep4 + correctStep5 + correctStep6 + correctStep7;

      correctPath.should.be.below(wrongPath);
    });
    it ('F# major ascending scale with 4,3,2,1,3,2,1,2 should be lower cost than 5,4,3,2,1,3,2,1', function() {
      var correctStep1= costDb['66,68,4,3'];
      var correctStep2 = costDb['68,70,3,2'];
      var correctStep3 = costDb['70,71,2,1'];
      var correctStep4 = costDb['71,73,1,3'];
      var correctStep5 = costDb['73,75,3,2'];
      var correctStep6 = costDb['75,77,2,1'];
      var correctStep7 = costDb['77,78,1,2'];

      var wrongStep1= costDb['66,68,5,4'];
      var wrongStep2 = costDb['68,70,4,3'];
      var wrongStep3 = costDb['70,71,3,2'];
      var wrongStep4 = costDb['71,73,2,1'];
      var wrongStep5 = costDb['73,75,1,3'];
      var wrongStep6 = costDb['75,77,3,2'];
      var wrongStep7 = costDb['77,78,2,1'];

      var wrongPath = wrongStep1 + wrongStep2 + wrongStep3 + wrongStep4 + wrongStep5 + wrongStep6 + wrongStep7;
      var correctPath = correctStep1 + correctStep2 + correctStep3 + correctStep4 + correctStep5 + correctStep6 + correctStep7;

      correctPath.should.be.below(wrongPath);
    });
    it ('F# major descending scale with 2,1,2,3,1,2,3,4 should be lower cost than 1,2,3,1,2,3,4,5', function() {
      var correctStep1= costDb['78,77,2,1'];
      var correctStep2 = costDb['77,75,1,2'];
      var correctStep3 = costDb['75,73,2,3'];
      var correctStep4 = costDb['73,71,3,1'];
      var correctStep5 = costDb['71,70,1,2'];
      var correctStep6 = costDb['70,68,2,3'];
      var correctStep7 = costDb['68,66,3,4'];

      var wrongStep1= costDb['78,77,1,2'];
      var wrongStep2 = costDb['77,75,2,3'];
      var wrongStep3 = costDb['75,73,3,1'];
      var wrongStep4 = costDb['73,71,1,2'];
      var wrongStep5 = costDb['71,70,2,3'];
      var wrongStep6 = costDb['70,68,3,4'];
      var wrongStep7 = costDb['68,66,4,5'];

      var wrongPath = wrongStep1 + wrongStep2 + wrongStep3 + wrongStep4 + wrongStep5 + wrongStep6 + wrongStep7;
      var correctPath = correctStep1 + correctStep2 + correctStep3 + correctStep4 + correctStep5 + correctStep6 + correctStep7;

      console.log('correctStep1: ', correctStep1);
      console.log('correctStep2: ', correctStep2);
      console.log('correctStep3: ', correctStep3);
      console.log('correctStep4: ', correctStep4);
      console.log('correctStep5: ', correctStep5);
      console.log('correctStep5: ', correctStep6);
      console.log('correctStep5: ', correctStep7);

      console.log('wrongStep1:** ', wrongStep1);
      console.log('wrongStep2: ', wrongStep2);
      console.log('wrongStep3: ', wrongStep3);
      console.log('wrongStep4: ', wrongStep4);
      console.log('wrongStep5: ', wrongStep5);
      console.log('wrongStep5: ', wrongStep6);
      console.log('wrongStep5: ', wrongStep7);

      correctPath.should.be.below(wrongPath);
    });
  });
});





















