var KeyboardDesign = function() {
  var keyType = {
    WhiteC:  0,
    WhiteD: 1,
    WhiteE:  2,
    WhiteF:  3,
    WhiteG: 4,
    WhiteA: 5,
    WhiteB: 6,
    Black:   7
  };

  var specs = {
    whiteKeyStep:       0.236,
    whiteKeyWidth:     0.226,
    whiteKeyHeight:    0.22,
    whiteKeyLength:    1.50,
    blackKeyWidth:      0.10,
    blackKeyHeight        : 0.24,
    blackKeyLength        : 1.00,
    blackKeyShiftCDE      : 0.0216,
    blackKeyShiftFGAB     : 0.0340,
    blackKeyPosY          : 0.10,
    blackKeyPosZ          : -0.24,
    noteDropPosZ4WhiteKey : 0.25,
    noteDropPosZ4BlackKey : 0.75,
    whiteKeyColor         : 0xffffff,
    blackKeyColor         : 0x111111,
    keyDip                : 0.08,
    keyUpSpeed            : 0.03,
    keyInfo               : [] // an array holding each key's type and position
  };

  
};