goog.provide('hlc.views.AlbumPlayer');

goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.dom.classes');
goog.require('hlc.views.common.CircularProgressBar');

/**
 * @constructor
 */
hlc.views.AlbumPlayer = function(domElement){
  goog.base(this);

  this.domElement = domElement;

  this._songs = null;
  this._currentSong = null;
  this._duration = 0;
  this._currentTime = 0;

  // create and added circular progress bar
  this.circularProgressBar = new hlc.views.common.CircularProgressBar(24);
  var circularProgressBarContainer = goog.dom.query('.progressIcon', this.domElement)[0];
  goog.dom.appendChild(circularProgressBarContainer, this.circularProgressBar.domElement);
};
goog.inherits(hlc.views.AlbumPlayer, goog.events.EventTarget);


hlc.views.AlbumPlayer.prototype.init = function(songs){
	this._songs = songs;
	this.gotoSong(0);
};


hlc.views.AlbumPlayer.prototype.getCurrentSong = function(){
	return this._currentSong;
};


hlc.views.AlbumPlayer.prototype.gotoSong = function(index){
	// handle last song
	if(this._currentSong) {
		goog.events.removeAll(this._currentSong);
	}

	// handle current song
	this._currentSong = goog.isNumber(index) ? this._songs[index] : this._currentSong;

	// add audio events
  goog.events.listen(this._currentSong.audio, 'loadedmetadata', function(e) {
  	this._duration = e.target.duration;
  }, false, this);

  goog.events.listen(this._currentSong.audio, 'timeupdate', function(e) {
  	this._currentTime = e.target.currentTime;

  	var progress = this._currentTime / this._duration;
  	this.circularProgressBar.setProgress(progress);
  }, false, this);

  goog.events.listen(this._currentSong.audio, 'play', function(e) {
  	this.dispatchEvent( {type: hlc.views.AlbumPlayer.EventType.PLAY} );
  }, false, this);

  goog.events.listen(this._currentSong.audio, 'pause', function(e) {
  	this.dispatchEvent( {type: hlc.views.AlbumPlayer.EventType.PAUSE} );
  }, false, this);

  goog.events.listen(this._currentSong.audio, 'ended', function(e) {
  	this.nextSong();
  }, false, this);

  // dispatch song change event
  var ev = {
  	type: hlc.views.AlbumPlayer.EventType.SONG_CHANGED,
  	song: this.getCurrentSong()
  };

  this.dispatchEvent(ev);
};


hlc.views.AlbumPlayer.prototype.nextSong = function(){
	var currentIndex = goog.array.indexOf(this._songs, this._currentSong);
  currentIndex ++;

	if(currentIndex > this._songs.length-1) currentIndex = 0;

	this.gotoSong(currentIndex);
};


hlc.views.AlbumPlayer.prototype.prevSong = function(){
	var currentIndex = goog.array.indexOf(this._songs, this._currentSong);
  currentIndex --;

	if(currentIndex < 0) currentIndex = this._songs.length-1;

	this.gotoSong(currentIndex);
};


hlc.views.AlbumPlayer.prototype.play = function(){
	this._currentSong.play();
};


hlc.views.AlbumPlayer.prototype.pause = function(){
	this._currentSong.pause();
};


hlc.views.AlbumPlayer.prototype.onResize = function(e){

};


hlc.views.AlbumPlayer.EventType = {
	PLAY: 'play',
	PAUSE: 'pause',
	SONG_CHANGED: 'song_changed'
};