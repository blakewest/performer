$(document).on('ready', function() {
  var app = window.app = new App();
  app.initScene();

});


  var sendToUpload = function(file) {
    app.upload(file);
  };












// var IO = function(file) {
//   // var uploadedFile = files[0];
//   console.log(file);
//   var reader = new FileReader();
//   reader.readAsDataURL(file);
//   reader.onload = function(e) {
//     var midiFile = e.target.result;
//     MIDI.Player.loadFile(midiFile);
//     var midiObj = MIDI.Player.data;
//     console.log('MIDI Object = ', midiObj);
//     fingeringAlgorithm(midiObj);
//   };
// };

// var IO = function(_fileElement, _callback){
//   if (!window.File || !window.FileReader){              // check browser compatibillity
//     if (this.debug) console.log('The File APIs are not fully supported in this browser.');
//     return false;
//   }
//   document.getElementById(_fileElement).onchange = (function(_t){   // set the file open event handler
//     return function(InputEvt){
//       if (!InputEvt.target.files.length) return false;
//       var reader = new FileReader();                // prepare the file Reader
//       reader.readAsArrayBuffer(InputEvt.target.files[0]);     // read the binary data
//       reader.onload = (function(_t) {               // when ready...
//         return function(e){
//           _callback( _t.loadFile(e.target.result)); // encode data with Uint8Array and call the parser
//         };
//       })(_t);
//     };
//   })(this);
// };