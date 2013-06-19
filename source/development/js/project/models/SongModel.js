goog.provide('hlc.models.SongModel');

goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.userAgent');

/**
 * @constructor
 */
hlc.models.SongModel = function(songId){
  goog.base(this);

  this.songId = songId;

  // audio waveform data
  this.audioData = null;

  // HTML audio
  var mp3Url = hlc.Url.UPLOAD_SONGS + songId + '.mp3';
  var oggUrl = hlc.Url.UPLOAD_SONGS + songId + '.ogg';

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