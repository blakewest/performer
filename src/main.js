var App = require('./App.js').App;
$(document).on('ready', function() {
  var app = window.app = new App();
  app.initMIDI(function() {
    app.initScene();
    $.ajax({
      url: '/getAllPaths',
      success: function(data) {
        var allPaths = JSON.parse(data);
        app.preComputed = allPaths;
        app.initPlayControls($('.main-container'), app);
        //Sound takes a while to load, so we use the setTimeout to ensure it's ready.
        setTimeout(function() {
          $($('.player-songList > li')[0]).trigger('click');
        }, 3300);
      }
    });

  });
});


