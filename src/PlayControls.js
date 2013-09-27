module.exports.PlayControls = function(container, app) {
  var $container = $(container);
  var $songListContainer = $('.player-songListContainer', this.$container);
  var $controlsContainer = $('.player-controls', this.$container);
  var $progressContainer = $('.player-progress-container', this.$container);
  console.log($progressContainer);

  var $progressBar = $('.player-progress-bar', this.$container);
  var $progressText = $('.player-progress-text', this.$container);
  var $songList = $('.player-songList', this.$container);
  var $song = $('.song', this.$container);

  console.log($progressBar);

  var $playBtn = $('.player-playBtn', this.$container);
  var $pauseBtn = $('.player-pauseBtn', this.$container);
  var $prevBtn = $('.player-prevBtn', this.$container);
  var $nextBtn = $('.player-nextBtn', this.$container);
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
  $prevBtn.click(function() {
    _this.onPrev();
  });
  $nextBtn.click(function() {
    _this.onNext();
  });

  $songList.click(function(event) {
    var $target = $(event.target);
    if ($target.is('li')) {
      // var $songList = $('li', _this.songList);
      var trackName = $target.text();
      app.player.stop();
      _this.playing === false;
      app.currentSong = trackName;
      $.ajax({
        url: '/songs/'+trackName,
        dataType: 'text',
        success: function(data) {
          app.loadMidiFile(data);
        }
      });
    }
    // var trackNo = $songList.index($target);
    // _this.setTrack(trackNo);
    console.log('songlist click getting called');
  
  });

  $progressContainer.click(function(event){
    console.log('progress container is getting clicked');
    var progressPercent = (event.clientX - $progressContainer.offset().left) / $progressContainer.width();
    console.log(progressPercent);
    _this.setCurrentTIme(progressPercent);
  });

  // $container.on('mousewheel', function(event) {
  //     event.stopPropagation();
  //   });

  this.play = function() {
    $playBtn.hide();
    $pauseBtn.show();
    _this.playing = true;
    app.player.start();
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
    var currentTime = app.player.endTime * progressPercent;
    app.player.currentTime = currentTime;
    setTimeout(app.player.resume, 10);
    app.player.pause();
  };
};