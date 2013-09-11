var KeyboardDesign = function() {
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
  this.whiteKeyColor                  = 0xffffff;
  this.blackKeyColor                  = 0x111111;
  this.keyDip                             = 0.08;
  this.keyUpSpeed                     = 0.03;
  this.keyInfo                            = [] ;// an array holding each key's type and position



};