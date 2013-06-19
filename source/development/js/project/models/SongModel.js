goog.provide('hlc.models.SongModel');

goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.string');
goog.require('goog.userAgent');

/**
 * @constructor
 */
hlc.models.SongModel = function(songId, songData){
  goog.base(this);

  this.songId = songId;
  this.songTitle = songData['title'];
  this.artwork = songData['artwork'];

  // audio waveform data
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
  return this.artwork[0];
};


hlc.models.SongModel.prototype.getNextArtwork = function(artwork){
  if(!artwork) {
    return this.getDefaultArtwork();
  }

  var currentIndex = goog.array.indexOf(this.artwork, artwork);
  var nextIndex = (currentIndex === this.artwork.length - 1) ? 0 : currentIndex+1;

  return this.artwork[nextIndex];
};


hlc.models.SongModel.prototype.load = function(){
	this.audio.addEventListener("canplaythrough", goog.bind(this.onCanPlayThrough, this), false);
};


hlc.models.SongModel.prototype.play = function(){
	this.audio.play();
};


hlc.models.SongModel.prototype.pause = function(){
	this.audio.pause();
};


hlc.models.SongModel.prototype.stop = function(){

};


hlc.models.SongModel.prototype.setVolume = function(volume){
	this.audio.volume = volume;
};


hlc.models.SongModel.prototype.onCanPlayThrough = function(e){
	console.log(songId + ' can play through.');
	this.dispatchEvent({type: 'canplaythrough'});
};