goog.provide('hlc.views.AlbumSection');

goog.require('hlc.models.AlbumModel');
goog.require('hlc.views.Section');
goog.require('hlc.views.AlbumPlayer');
goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.dom.query');

/**
 * @constructor
 */
hlc.views.AlbumSection = function(domElement){
  goog.base(this, domElement);

  this.albumModel = null;

  this.backgroundDomElement = goog.dom.getElementByClass('background', this.domElement);

  var backgrounds = goog.dom.getChildren(this.backgroundDomElement);
  this._bg1DomElement = backgrounds[0];
  this._bg2DomElement = backgrounds[1];
  this._loaderDomElement = backgrounds[3];

  this._currentArtwork = null;
  this._nextArtwork = null;
  this._currentBgDomElement = this._bg1DomElement;
  this._nextBgDomElement = null;
  this._loaderImage = new Image();

  this._crossfadeTimer = new goog.Timer(20000);

  this._isAtSection = false;

  // album player
  var albumPlayerDomElement = goog.dom.query('.albumPlayer', domElement)[0];
  this.albumPlayer = new hlc.views.AlbumPlayer(albumPlayerDomElement);
};
goog.inherits(hlc.views.AlbumSection, hlc.views.Section);


hlc.views.AlbumSection.prototype.init = function(){
	goog.base(this, 'init');

	// set model
	var albumId = this.domElement.getAttribute('data-id');
	var albumData = hlc.main.assets.sitemap['albums'][albumId];
	this.albumModel = new hlc.models.AlbumModel(albumId, albumData);

	//console.log(this.albumModel);

	// listen for crossfade timer event
	goog.events.listen(this._crossfadeTimer, goog.Timer.TICK, this.onCrossfadeTick, false, this);

	// listen for song event
	goog.events.listen(this.albumPlayer, 'play', this.onPlay, false, this);
	goog.events.listen(this.albumPlayer, 'pause', this.onPause, false, this);
	goog.events.listen(this.albumPlayer, hlc.views.AlbumPlayer.EventType.SONG_CHANGED, this.onSongChanged, false, this);

	// listen for album scroll event
	goog.events.listen(hlc.main.controllers.albumScrollController,
		hlc.controllers.AlbumScrollController.EventType.SCROLL_FINISH, this.onScrollFinish, false, this);

	// set album player
	this.albumPlayer.init(this.albumModel.songs);

	// set initial background opacity
	goog.style.setOpacity(this._bg1DomElement, 0);
	goog.style.setOpacity(this._bg2DomElement, 0);
	goog.style.setOpacity(this._loaderDomElement, 0);
};


hlc.views.AlbumSection.prototype.onCrossfadeTick = function(e){
	var currentSong = this.albumPlayer.getCurrentSong();

	var nextArtwork = currentSong.getNextArtwork(this._currentArtwork);
	
	if(nextArtwork !== this._currentArtwork) {
		this._nextArtwork = nextArtwork;
	}else {
		return false;
	}

	goog.style.setOpacity(this._loaderDomElement, 1);

	this._nextBgDomElement = (this._currentBgDomElement === this._bg1DomElement) ? this._bg2DomElement : this._bg1DomElement;

	goog.events.listenOnce(this._loaderImage, 'load', this.crossfade, false, this);
	this._loaderImage.src = this._nextArtwork['url'];
};


hlc.views.AlbumSection.prototype.crossfade = function() {
	// set current artwork
	this._currentArtwork = this._nextArtwork;
	this._nextArtwork = null;

	// fade in next background, fade out current background
	var imageUrl = this._currentArtwork['url'];
	goog.style.setStyle(this._nextBgDomElement, 'background-image', 'url(' + imageUrl + ')');
	goog.style.setOpacity(this._nextBgDomElement, 1);
	goog.style.setOpacity(this._currentBgDomElement, 0);
	goog.style.setOpacity(this._loaderDomElement, 0);

	this._currentBgDomElement = this._nextBgDomElement;
	this._nextBgDomElement = null;

	// reset loader image src for loading next image
	this._loaderImage.src = '';

	//
	hlc.main.views.footer.setPhotographyCopyright(this._currentArtwork['copyright']);
};


hlc.views.AlbumSection.prototype.onPlay = function(e){
	this._crossfadeTimer.start();
};


hlc.views.AlbumSection.prototype.onPause = function(e){
	this._crossfadeTimer.stop();
};


hlc.views.AlbumSection.prototype.onSongChanged = function(e){
	this._currentArtwork = null;
	this._crossfadeTimer.dispatchTick();

	if(this._isAtSection) {
		this.albumPlayer.getCurrentSong().activate();
		this.albumPlayer.play();
	}
};


hlc.views.AlbumSection.prototype.onScrollFinish = function(e){
	if(e.albumSection === this) {

		this._isAtSection = true;

		// play song
		this.albumPlayer.getCurrentSong().activate();
		this.albumPlayer.activate();
		this.albumPlayer.play();

		//
		hlc.main.views.footer.setPhotographyCopyright(this._currentArtwork['copyright']);

	}else {

		this._isAtSection = false;

		// stop song
		this.albumPlayer.stop();

		goog.Timer.callOnce(function() {
			this.albumPlayer.getCurrentSong().deactivate();
			this.albumPlayer.deactivate();
		}, 0, this);

	}
};


hlc.views.AlbumSection.prototype.onNavigate = function(e){

};


hlc.views.AlbumSection.prototype.onResize = function(e){
	goog.base(this, 'onResize', e);

};