var App = require('./App.js').App;
$(document).on('ready', function() {
  var app = window.app = new App();
  console.log("Hey trying to init!!!")
  app.initMIDI(function() {
    app.initScene();
    $.ajax({
      url: '/getAllPaths',
      dataType: 'json',
      success: function(data) {
        app.preComputed = data;
        app.initPlayControls($('.main-container'), app);

        //Triggers a click for first song.
        $($('.player-songList > li')[0]).trigger('click');
      },
      error: function(error) {
        // Initialize the app anyway. This route is just for getting cached values.
        app.initPlayControls($('.main-container'), app);

        //Triggers a click for first song.
        $($('.player-songList > li')[0]).trigger('click');
      }
    });

  });
});


