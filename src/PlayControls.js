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
    if (_this.current === 'paused') {
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
    // var $target = $(event.target);
    // if ($target.is('li')) {
    //   var $songList = $('li', _this.songList);
    //   var trackNo = $songList.index($target);
    //   _this.setTrack(trackNo);
    // }
    console.log('songlist click getting called');
    $.ajax({
      url: '/songname',
      // dataType: 'text',
      success: function(data) {
        // app.loadMidiFile(data);
        var parsedData = JSON.parse(data);
        console.log('data after GET request...', parsedData);
        var parsedSong = parsedData[0];
        // var parsedReplayer = parsedData[1];
        // app.player.data = parsedSong;
        // app.player.replayer = parsedReplayer;
        app.preComputed.push(parsedSong);
      }
    });
  });

  $song.click(function(event) {
    console.log('songlist click getting called');
    $.ajax({
      url: '/songname2',
      dataType: 'text',
      success: function(data) {
        app.loadMidiFile(data);
      }
    });
  });

  $container.on('mousewheel', function(event) {
      event.stopPropagation();
    });

  this.play = function() {
    $playBtn.hide();
    $pauseBtn.show();
    _this.current = 'playing';
    app.player.resume();
    app.playing = true;
  };

  this.resume = function() {
    $playBtn.hide();
    $pauseBtn.show();
    app.player.currentTime += 1e-6;
    app.player.resume();
    app.playing = true;
  };

  this.stop = function() {
    app.player.stop();
    app.playing = false;
  };

  this.pause = function() {
    _this.current = 'paused';
    $playBtn.show();
    $pauseBtn.hide();
    app.player.pause();
    app.playing = false;
  };

  this.getEndTime = function() {
    return app.player.endTime;
  };

  this.displayProgress = function(current, total) {
    var percent = current/total;
    var newWidth = Math.floor(percent*$progressContainer.width());
    $progressBar.width(newWidth);
  };

  this.setCurrentTIme = function(currentTime) {
    app.player.pause();
    app.player.currentTime = currentTime;
    if (app.playing) {
      app.player.resume();
    }
  };
};