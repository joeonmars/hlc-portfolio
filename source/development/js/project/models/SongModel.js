goog.provide('hlc.models.SongModel');

goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.string');
goog.require('goog.userAgent');
goog.require('goog.net.BulkLoader');

/**
 * @constructor
 */
hlc.models.SongModel = function(songId, songData, album){
  goog.base(this);

  this.setParentEventTarget( hlc.main.controllers.soundController );

  this.songId = songId;
  this.songTitle = songData['title'];
  this.artwork = songData['artwork'];
  this.album = album;
  this.defaultArtwork = {url: this.album.albumCover};

  // audio data
  var url = songData['audioData'];
  this.jsonLoader = null;
  if(url) {
    this.jsonLoader = new goog.net.BulkLoader( [url] );
    goog.events.listenOnce(this.jsonLoader, goog.net.EventType.SUCCESS, this.onAudioDataLoadSuccess, false, this);
    goog.events.listenOnce(this.jsonLoader, goog.net.EventType.ERROR, this.onAudioDataLoadError, false, this);
  }

  this.audioData = null;

  // HTML audio
  var audioUrls = songData['assets'];
  var mp3Url, oggUrl;
  goog.array.forEach(audioUrls, function(audioUrl) {
    if(goog.string.endsWith(audioUrl, '.mp3')) {
      mp3Url = audioUrl;
    }else if(goog.string.endsWith(audioUrl, '.ogg')) {
      oggUrl = audioUrl;
    }
  });

  this.audio = new Audio();
  this.audio.setAttribute('preload', 'none');

  if(goog.userAgent.GECKO || goog.userAgent.OPERA) {
  	this.audio.setAttribute('src', oggUrl);
  	this.audio.setAttribute('type', 'audio/ogg');
  }else {
  	this.audio.setAttribute('src', mp3Url);
  	this.audio.setAttribute('type', 'audio/mpeg');
  }
};
goog.inherits(hlc.models.SongModel, goog.events.EventTarget);


hlc.models.SongModel.prototype.getDefaultArtwork = function(){
  if(this.artwork.length < 1) {
    return this.defaultArtwork;
  }else {
    return this.artwork[0];
  }
};


hlc.models.SongModel.prototype.getNextArtwork = function(artwork){
  if(!artwork || artwork === this.defaultArtwork) {
    return this.getDefaultArtwork();
  }

  var currentIndex = goog.array.indexOf(this.artwork, artwork);
  var nextIndex = (currentIndex === this.artwork.length - 1) ? 0 : currentIndex+1;

  return this.artwork[nextIndex];
};


hlc.models.SongModel.prototype.activate = function(){
  goog.events.listen(this.audio, hlc.models.SongModel.EventType.HTML_AUDIO_EVENTS, this.onAudioEvent, false, this);

  if(this.jsonLoader) this.jsonLoader.load();
  else this.dispatchAudioDataLoadEvent();

  hlc.main.controllers.soundController.setCurrentSound(this);
};


hlc.models.SongModel.prototype.deactivate = function(){
  goog.events.unlisten(this.audio, hlc.models.SongModel.EventType.HTML_AUDIO_EVENTS, this.onAudioEvent, false, this);
};


hlc.models.SongModel.prototype.play = function(){
	this.audio.play();
};


hlc.models.SongModel.prototype.pause = function(){
	this.audio.pause();
};


hlc.models.SongModel.prototype.stop = function(){
  this.audio.pause();
};


hlc.models.SongModel.prototype.setProgress = function(progress){
  this.audio.currentTime = this.audio.duration * progress;
};


hlc.models.SongModel.prototype.isPaused = function() {
  return this.audio.paused;
};


hlc.models.SongModel.prototype.setVolume = function(volume){
	this.audio.volume = volume;
};


hlc.models.SongModel.prototype.dispatchAudioDataLoadEvent = function(){
  this.dispatchEvent({
    target: this,
    type: hlc.models.SongModel.EventType.AUDIO_DATA_LOAD,
    audioData: this.audioData || []
  });
};


hlc.models.SongModel.prototype.onAudioEvent = function(e){
  this.dispatchEvent({
    target: this,
    type: e.type,
    audio: e.target
  });
};


hlc.models.SongModel.prototype.onAudioDataLoadSuccess = function(e) {
  // read and post-process data
  this.audioData = goog.array.map(e.target.getResponseTexts(), goog.json.unsafeParse)[0]['data'];

  var accumulated = 0;
  for ( var i = 0; i < this.audioData.length; i ++ ) {
    this.audioData[ i ] = accumulated += this.audioData[ i ];
  }

  this.dispatchAudioDataLoadEvent();

  // dispose json loader
  this.jsonLoader.dispose();
  this.jsonLoader = null;
};


hlc.models.SongModel.prototype.onAudioDataLoadError = function(e) {
  this.jsonLoader.dispose();
  this.jsonLoader = null;
};


hlc.models.SongModel.EventType = {
  HTML_AUDIO_EVENTS: ['loadedmetadata', 'play', 'pause', 'ended', 'canplaythrough', 'timeupdate'],
  AUDIO_DATA_LOAD: 'audio_data_load'
};