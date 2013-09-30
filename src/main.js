var App = require('./App.js').App;
$(document).on('ready', function() {
  var app = window.app = new App(); //maybe put the whole app in a name space(like b), then if you need to refer to it, you can  refer to app as b.app
  app.initMIDI();
  $.ajax({
    url: '/getAllPaths',
    success: function(data) {
      var allPaths = JSON.parse(data);
      app.preComputed = allPaths;
    }
  });
  app.initPlayControls($('.main-container'), app);
  app.initScene();
  //Sound takes a while to load, so we use the setTimeout to ensure it's ready.
  setTimeout(function() {
    $($('.player-songList > li')[0]).trigger('click');
  }, 3600);
});


