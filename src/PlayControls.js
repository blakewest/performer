module.exports.PlayControls = function(container, app) {
  var $container = $(container);
  var $songListContainer = $('.player-songListContainer');
  var $controlsContainer = $('.player-controls');
  var $progressContainer = $('.player-progress-container');

  var $progressBar = $('.player-progress-bar');
  var $progressText = $('.player-progress-text');
  var $songList = $('.player-songList');
  var $song = $('.song');
  var $tempoChanger = $('.tempo-changer');
  var $playBtn = $('.player-playBtn');
  var $pauseBtn = $('.player-pauseBtn');
  var $currentSong = $('.current-song')

  var _this = this;

  //Set up all helper functions
  this.play = function() {
    $playBtn.hide();
    $pauseBtn.show();
    _this.playing = true;
    app.player.resume();
  };

  this.playHandler = function() {
    if (_this.playing === false) {
      _this.resume();
    }else {
      _this.play();
    }
  };

  this.pauseHandler = function() {
    _this.pause();
  };

  this.songListHandler = function(event) {
    var $target = $(event.target);
    var trackName = $target.text();
    $currentSong.text(trackName);
    _this.playing = false;
    app.currentSong = trackName;
    $.ajax({
      url: '/songs/'+trackName,
      dataType: 'text',
      success: function(data) {
        app.loadMidiFile(data, 0);
      }
    });
  };

  this.resume = function() {
    $playBtn.hide();
    $pauseBtn.show();
    app.player.currentTime += 1e-6; //fixed bug in MIDI.js
    _this.playing = true;
    app.player.resume();
  };

  this.stop = function() {
    app.player.stop();
    _this.playing = false;
  };

  this.progressHandler = function(event){
    var progressPercent = (event.clientX - $progressContainer.offset().left) / $progressContainer.width();
    _this.setCurrentTime(progressPercent);
  };

  this.tempoHandler = function(event) {
    var $target = $(event.target);
    var timeWarp = $target.find('input').attr('data-timeWarp');
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
  };

  this.pause = function() {
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

  this.setCurrentTime = function(progressPercent) {
    var currentTime = app.player.endTime * progressPercent;
    app.player.currentTime = currentTime;
    setTimeout(_this.resume, 10);
    app.player.pause();
  };

  //Set up all click handlers
  $playBtn.on('click', _this.playHandler);
  $pauseBtn.on('click', _this.pauseHandler);
  $songList.on('click', _this.songListHandler);
  $progressContainer.on('click', _this.progressHandler);
  $tempoChanger.on('click', _this.tempoHandler);
};