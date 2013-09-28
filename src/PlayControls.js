module.exports.PlayControls = function(container, app) {
  var $container = $(container);
  var $songListContainer = $('.player-songListContainer', this.$container);
  var $controlsContainer = $('.player-controls', this.$container);
  var $progressContainer = $('.player-progress-container', this.$container);

  var $progressBar = $('.player-progress-bar', this.$container);
  var $progressText = $('.player-progress-text', this.$container);
  var $songList = $('.player-songList', this.$container);
  var $song = $('.song', this.$container);
  var $tempoChanger = $('.tempo-changer', this.$container);

  var $playBtn = $('.player-playBtn', this.$container);
  var $pauseBtn = $('.player-pauseBtn', this.$container);

  var $currentSong = $('.current-song')

  var _this = this;

  $playBtn.click(function() {
    if (_this.playing === false) {
      _this.resume();
    }else {
      _this.play();
    }
  });
  $pauseBtn.click(function() {
    _this.pause();
  });

  $songList.on('click', function(event) {
    var $target = $(event.target);
    var trackName = $target.text();
    $currentSong.text(trackName);
    _this.playing = false;
    app.currentSong = trackName;
    console.log(app.currentSong);
    $.ajax({
      url: '/songs/'+trackName,
      dataType: 'text',
      success: function(data) {
        app.loadMidiFile(data, 0);
      }
    });
    console.log('songlist click getting called');
  });

  $progressContainer.click(function(event){
    console.log('progress container is getting clicked');
    var progressPercent = (event.clientX - $progressContainer.offset().left) / $progressContainer.width();
    console.log(progressPercent);
    _this.setCurrentTIme(progressPercent);
  });

  $tempoChanger.click(function(event) {
    var $target = $(event.target);
    var timeWarp = $target.find('input').attr('data-timeWarp');
    console.log(timeWarp);
    app.player.timeWarp = timeWarp;
    var trackName = app.currentSong;
    $.ajax({
      url: '/songs/'+trackName,
      dataType: 'text',
      success: function(data) {
        var currentProgress = $progressBar.width()/$progressContainer.width();
        app.loadMidiFile(data,  currentProgress);
      }
    });
  })

  // $container.on('mousewheel', function(event) {
  //     event.stopPropagation();
  //   });

  this.play = function() {
    console.log('play is getting called');
    $playBtn.hide();
    $pauseBtn.show();
    _this.playing = true;
    app.player.resume();
  };

  this.resume = function() {
    $playBtn.hide();
    $pauseBtn.show();
    app.player.currentTime += 1e-6; //fixed bug in MIDI.js
    _this.playing = true;
    console.log('resume is getting called');
    app.player.resume();
  };

  this.stop = function() {
    app.player.stop();
    _this.playing = false;
  };

  this.pause = function() {
    console.log('pause is getting called');
    _this.playing = false;
    $playBtn.show();
    $pauseBtn.hide();
    app.player.pause();
    _this.resume();
  };

  this.getEndTime = function() {
    return app.player.endTime;
  };

  this.displayProgress = function(current, total) {
    var percent = current/total;
    var newWidth = Math.floor(percent*$progressContainer.width());
    $progressBar.width(newWidth);
  };

  this.setCurrentTIme = function(progressPercent) {
    console.log('set current time is getting called');
    var currentTime = app.player.endTime * progressPercent;
    app.player.currentTime = currentTime;
    setTimeout(_this.resume, 10);
    app.player.pause();
  };
};