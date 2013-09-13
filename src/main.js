$(document).on('ready', function() {
  var app = window.app = new App(); //maybe put the whole app in a name space(like b), then if you need to refer to it, you can  refer to app as b.app
  app.initScene();
  app.initMIDI();
});

var sendToUpload = function(file) {
  app.upload(file);
};

