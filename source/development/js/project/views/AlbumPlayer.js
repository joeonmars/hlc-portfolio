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

  this.prevButton = goog.dom.query('.top .arrowButton', this.domElement)[0];
  this.nextButton = goog.dom.query('.bottom .arrowButton', this.domElement)[0];

  this.topScroller = goog.dom.query('.top ul', this.domElement)[0];
  this.middleScroller = goog.dom.query('.middle ul', this.domElement)[0];
  this.bottomScroller = goog.dom.query('.bottom ul', this.domElement)[0];

  this.scrollerTweener = new TimelineMax({
    onComplete: this.onScrollerComplete,
    onCompleteScope: this
  });

  this._songs = null;
  this._currentSong = null;
  this._duration = 0;
  this._currentTime = 0;

  // create and added circular progress bar
  this.circularProgressBar = new hlc.views.common.CircularProgressBar(24);
  var circularProgressBarContainer = goog.dom.query('.middle .iconContainer', this.domElement)[0];
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


hlc.views.AlbumPlayer.prototype.gotoSongById = function(songId) {
  var songIndex = goog.array.findIndex(this._songs, function(song) {
    return song.songId === songId;
  });

  if(songIndex > -1) {
    this.gotoSong(songIndex);
  }
};


hlc.views.AlbumPlayer.prototype.gotoSong = function(index){
  // to determine if go prev(-1) or next(1)
  var delta = 1;

  if(this._currentSong) {
    this.stop();

    var lastIndex = goog.array.indexOf(this._songs, this._currentSong);
    delta = (index > lastIndex) ? 1 : -1;
  }

  this._currentSong = goog.isNumber(index) ? this._songs[index] : this._currentSong;

  // dispatch song change event
  var ev = {
  	type: hlc.views.AlbumPlayer.EventType.SONG_CHANGED,
  	song: this.getCurrentSong()
  };

  this.dispatchEvent(ev);

  // scroll to song
  var sideScrollerHeight = goog.style.getSize(this.topScroller).height;
  var middleScrollerHeight = goog.style.getSize(this.middleScroller).height;

  var middleSongIndex = index + 1;
  var topSongIndex = middleSongIndex - 1;
  var bottomSongIndex = middleSongIndex + 1;

  var topY = sideScrollerHeight * topSongIndex;
  var middleY = middleScrollerHeight * middleSongIndex;
  var bottomY = sideScrollerHeight * bottomSongIndex;

  var topTweener = TweenMax.to(this.topScroller, .4, {scrollTo: {y: topY}, ease:Power2.easeOut});
  var middleTweener = TweenMax.to(this.middleScroller, .4, {scrollTo: {y: middleY}, ease:Power2.easeOut});
  var bottomTweener = TweenMax.to(this.bottomScroller, .4, {scrollTo: {y: bottomY}, ease:Power2.easeOut});

  this.scrollerTweener.kill();
  this.scrollerTweener.clear();

  if(delta === -1) {
    this.scrollerTweener.add([topTweener, middleTweener, bottomTweener], '+=0', 'start', .15);
  }else {
    this.scrollerTweener.add([bottomTweener, middleTweener, topTweener], '+=0', 'start', .15);
  }

  // set button state
  var isPrevButtonInactive = (index === 0);
  if(isPrevButtonInactive) goog.dom.classes.add(this.prevButton, 'inactive');
  else goog.dom.classes.remove(this.prevButton, 'inactive');

  var isNextButtonInactive = (index === this._songs.length-1);
  if(isNextButtonInactive) goog.dom.classes.add(this.nextButton, 'inactive');
  else goog.dom.classes.remove(this.nextButton, 'inactive');
};


hlc.views.AlbumPlayer.prototype.nextSong = function(){
	var currentIndex = goog.array.indexOf(this._songs, this._currentSong);
  currentIndex ++;

	if(currentIndex > this._songs.length-1) currentIndex = 0;

  var song = this._songs[currentIndex];
  this.setSongToken(song);
};


hlc.views.AlbumPlayer.prototype.prevSong = function(){
	var currentIndex = goog.array.indexOf(this._songs, this._currentSong);
  currentIndex --;

	if(currentIndex < 0) currentIndex = this._songs.length-1;

  var song = this._songs[currentIndex];
  this.setSongToken(song);
};


hlc.views.AlbumPlayer.prototype.setSongToken = function(song){
  var songId = song.songId;
  var albumId = song.album.albumId;
  
  hlc.main.controllers.navigationController.setToken('/album/'+albumId+'/'+songId);
};


hlc.views.AlbumPlayer.prototype.activate = function(){
  goog.events.listen(this.prevButton, 'click', this.onClick, false, this);
  goog.events.listen(this.nextButton, 'click', this.onClick, false, this);

  // listen for audio events from SoundController
  goog.events.listen(this, 'loadedmetadata', this.onLoadedMetaData, false, this);
  goog.events.listen(this, 'timeupdate', this.onTimeUpdate, false, this);
  goog.events.listen(this, 'canplaythrough', this.onCanPlayThrough, false, this);
  goog.events.listen(this, 'ended', this.onEnded, false, this);

  hlc.main.controllers.soundController.addDispatcher(this);
};


hlc.views.AlbumPlayer.prototype.deactivate = function(){
  goog.events.unlisten(this.prevButton, 'click', this.onClick, false, this);
  goog.events.unlisten(this.nextButton, 'click', this.onClick, false, this);

  // unlisten for audio events from SoundController
  goog.events.unlisten(this, 'loadedmetadata', this.onLoadedMetaData, false, this);
  goog.events.unlisten(this, 'timeupdate', this.onTimeUpdate, false, this);
  goog.events.unlisten(this, 'canplaythrough', this.onCanPlayThrough, false, this);
  goog.events.unlisten(this, 'ended', this.onEnded, false, this);

  hlc.main.controllers.soundController.removeDispatcher(this);
};


hlc.views.AlbumPlayer.prototype.play = function(){
	this._currentSong.play();
};


hlc.views.AlbumPlayer.prototype.pause = function(){
	this._currentSong.pause();
};


hlc.views.AlbumPlayer.prototype.stop = function(){
  this._currentSong.stop();
};


hlc.views.AlbumPlayer.prototype.onScrollerComplete = function(e){

};


hlc.views.AlbumPlayer.prototype.onLoadedMetaData = function(e){
  this._duration = e.target.audio.duration;
};


hlc.views.AlbumPlayer.prototype.onCanPlayThrough = function(e){
  console.log(goog.getUid(this), 'canplaythrough');
};


hlc.views.AlbumPlayer.prototype.onTimeUpdate = function(e){
  this._currentTime = e.target.audio.currentTime;

  var progress = this._currentTime / this._duration;
  this.circularProgressBar.setProgress(progress);
};


hlc.views.AlbumPlayer.prototype.onEnded = function(e){
  this.nextSong();
};


hlc.views.AlbumPlayer.prototype.onClick = function(e){
  switch(e.currentTarget) {
    case this.prevButton:
    this.prevSong();
    break;

    case this.nextButton:
    this.nextSong();
    break;

    default:
    break;
  }
};


hlc.views.AlbumPlayer.prototype.onResize = function(e){

};


hlc.views.AlbumPlayer.EventType = {
	SONG_CHANGED: 'song_changed'
};