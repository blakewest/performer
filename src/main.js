var App = require('./App.js').App;
$(document).on('ready', function() {
  var app = window.app = new App();
  app.initMIDI(function() {
    app.initScene();
    $.ajax({
      url: '/getAllPaths',
      dataType: 'json',
      success: function(data) {
        app.preComputed = data;
        app.initPlayControls($('.main-container'), app);
        //triggers a click for first song.
        $($('.player-songList > li')[0]).trigger('click');
      }
    });

  });
});


