module.exports.KeyboardDesign = function() {
  this.KeyType = {
    WhiteC:  0,
    WhiteD: 1,
    WhiteE:  2,
    WhiteF:  3,
    WhiteG: 4,
    WhiteA: 5,
    WhiteB: 6,
    Black:   7
  };

  this.whiteKeyStep                  = 0.236;
  this.whiteKeyWidth                = 0.226;
  this.whiteKeyHeight               = 0.22;
  this.whiteKeyLength               = 1.50;
  this.blackKeyWidth                 =0.10;
  this.blackKeyHeight               = 0.24;
  this.blackKeyLength               = 1.00;
  this.blackKeyShiftCDE            = 0.0216;
  this.blackKeyShiftFGAB           = 0.0340;
  this.blackKeyPosY                   = 0.10;
  this.blackKeyPosZ                   = -0.24;
  this.noteDropPosZ4WhiteKey  = 0.25;
  this.noteDropPosZ4BlackKey  = 0.75;
  this.whiteKeyColor                  = 'rgb(0.99,0.99,0.99)';
  this.blackKeyColor                  = 'rgb(0.5,0.5,0.5)';
  this.keyDip                             = 0.08;
  this.keyUpSpeed                     = 0.03;
  this.keyInfo                            = [] ;// an array holding each key's type and position

  var _this = this;
  //essentially an initialization function
  var createBoardInfo = function() {
    makeNoteObjects();
    initKeyType();
    initKeyPos();
  };

  var makeNoteObjects = function() {
    for (var i = 0; i < 120; i++) {
      var noteObj = {};
      _this.keyInfo.push(noteObj);
    }
  };

  var initKeyType = function() {
    var KeyType = _this.KeyType;
    var keyInfo = _this.keyInfo;
    for (var i = 0; i< 10; i++) {
      var noteNo = 12*i;
      keyInfo[noteNo + 0].keyType = KeyType.WhiteC;
      keyInfo[noteNo + 1].keyType = KeyType.Black;
      keyInfo[noteNo + 2].keyType = KeyType.WhiteD;
      keyInfo[noteNo + 3].keyType = KeyType.Black;
      keyInfo[noteNo + 4].keyType = KeyType.WhiteE;
      keyInfo[noteNo + 5].keyType = KeyType.WhiteF;
      keyInfo[noteNo + 6].keyType = KeyType.Black;
      keyInfo[noteNo + 7].keyType = KeyType.WhiteG;
      keyInfo[noteNo + 8].keyType = KeyType.Black;
      keyInfo[noteNo + 9].keyType = KeyType.WhiteA;
      keyInfo[noteNo + 10].keyType = KeyType.Black;
      keyInfo[noteNo + 11].keyType = KeyType.WhiteD;
    }
  };

  var initKeyPos = function() {
    //setting up convenience vars
    var keyInfo         = _this.keyInfo;
    var KeyType        = _this.KeyType;
    var prevKeyType = KeyType.WhiteB;
    var noteNo         = 0;
    var posX             = 0.0;
    var shift             = 0.0;
    var Black            = KeyType.Black;

    //setting position of first note;
    keyInfo[noteNo].keyCenterPosX = posX;
    prevKeyType = keyInfo[noteNo].keyType;

    //set position of all the rest of the notes.

    for ( noteNo = 1; noteNo< keyInfo.length; noteNo++) {
      if (prevKeyType === Black) {
        posX += _this.whiteKeyStep / 2.0;
      }else {
        if (keyInfo[noteNo].keyType === Black) {
          posX += _this.whiteKeyStep / 2.0;
        }else {
          posX += _this.whiteKeyStep;
        }
      }
      keyInfo[noteNo].keyCenterPosX = posX;
      prevKeyType = keyInfo[noteNo].keyType;
    }

  };

  //calling initialization function
  createBoardInfo();
};




























