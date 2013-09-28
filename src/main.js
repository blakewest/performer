var App = require('./App.js').App;
$(document).on('ready', function() {
  var app = window.app = new App(); //maybe put the whole app in a name space(like b), then if you need to refer to it, you can  refer to app as b.app
  $.ajax({
    url: '/getAllPaths',
    // dataType: 'text',
    success: function(data) {
      var allPaths = JSON.parse(data);
      console.log('data after GET request...', allPaths);
      app.preComputed = allPaths;
    }
  });
  console.log('app Pre Computed = ', app.preComputed);
  app.initMIDI();
  app.initPlayControls($('.main-container'), app);
  app.initScene();
  setTimeout(function() {
    $($('.player-songList > li')[0]).trigger('click');
  }, 1500);
});


