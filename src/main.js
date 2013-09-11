$(document).on('ready', function() {
  var app = window.app = new App();
  app.initScene();
  app.initMIDI();
});

var sendToUpload = function(file) {
  app.upload(file);
};
