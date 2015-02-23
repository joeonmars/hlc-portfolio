goog.provide('hlc.controllers.AlbumController');

goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.dom.classlist');
goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('hlc.fx.Timer');
goog.require('hlc.models.AlbumModel');
goog.require('hlc.views.Section');
goog.require('hlc.views.AlbumPlayer');
goog.require('hlc.utils');
goog.require('hlc.events');

/**
 * @constructor
 */
hlc.controllers.AlbumController = function(domElement, albumIndex){

  goog.base(this, domElement);

  this.albumModel = null;
  this.albumIndex = albumIndex;

  this._currentArtwork = null;
  this._nextArtwork = null;
  this._loaderImage = new Image();

  this._crossfadeTimer = new hlc.fx.Timer( this.onCrossfadeTick,
  	hlc.controllers.AlbumController.CROSSFADE_DURATION, this );

  this._crossfadeDelay = new goog.async.Delay( function() {
  	this._crossfadeTimer.tick();
  	this._crossfadeTimer.start( true );
  }, 2000, this );

  this._isAtSection = false;

  // album player
  var albumPlayerDomElement = goog.dom.query('.albumPlayer', domElement)[0];
  this.albumPlayer = new hlc.views.AlbumPlayer(albumPlayerDomElement);
};
goog.inherits(hlc.controllers.AlbumController, hlc.views.Section);


hlc.controllers.AlbumController.prototype.init = function(){

	goog.base(this, 'init');

	// set model
	var albumId = this.domElement.getAttribute('data-id');
	var albumData = hlc.main.assets['sitemap']['albums'][albumId];
	this.albumModel = new hlc.models.AlbumModel(albumId, albumData);

	// listen for navigate event
	hlc.main.controllers.navigationController.addDispatcher(this);
	goog.events.listen(this, goog.history.EventType.NAVIGATE, this.onNavigate, false, this);

	// listen for song event
	goog.events.listen(this.albumPlayer, 'play', this.onPlay, false, this);
	goog.events.listen(this.albumPlayer, 'pause', this.onPause, false, this);
	goog.events.listen(this.albumPlayer, hlc.views.AlbumPlayer.EventType.SONG_CHANGED, this.onSongChanged, false, this);

	// listen for credits event
	goog.events.listen( hlc.main.views.credits, hlc.events.EventType.ANIMATE_IN_START, this.hideUI, false, this );
  	goog.events.listen( hlc.main.views.credits, hlc.events.EventType.ANIMATE_OUT_START, this.showUI, false, this );

	// listen for album scroll event
	goog.events.listen(hlc.main.controllers.albumScrollController,
		hlc.events.EventType.SCROLL_COMPLETE, this.onScrollFinish, false, this);

	// set album player
	this.albumPlayer.init(this.albumModel.songs);
};


hlc.controllers.AlbumController.prototype.onCrossfadeTick = function(e){

	var currentSong = this.albumPlayer.getCurrentSong();

	var nextArtwork = currentSong.getNextArtwork(this._currentArtwork);
	
	if(nextArtwork && this._currentArtwork && nextArtwork['title'] === this._currentArtwork['title']) {
		return false;
	}

	this._nextArtwork = nextArtwork;

	// load the next artwork
	goog.events.listenOnce(this._loaderImage, 'load', this.crossfade, false, this);

	var urlObj = this._nextArtwork['url'];
	var url = (hlc.utils.isTablet() && !hlc.utils.isRetina()) ? urlObj['lowRes'] : urlObj['highRes'];
	this._loaderImage.src = '';
	this._loaderImage.src = url;
	this._loaderImage.setAttribute('data-id', this._nextArtwork['title']);
	this._loaderImage.setAttribute('data-transition', this._nextArtwork['transition']);
};


hlc.controllers.AlbumController.prototype.crossfade = function() {

	// set current artwork
	this._currentArtwork = this._nextArtwork;
	this._nextArtwork = null;

	//hlc.main.views.footer.updatePhotography(this._currentArtwork);

	// kick off the timer til next crossfade
	this._crossfadeTimer.start( true );

	// fade in next background, fade out current background
	this.dispatchEvent({
		type: hlc.events.EventType.CROSSFADE,
		img: this._loaderImage
	});
};


hlc.controllers.AlbumController.prototype.showUI = function(){

  goog.dom.classlist.enable( this.domElement, 'ui-hidden', false );
};


hlc.controllers.AlbumController.prototype.hideUI = function(){
  
  goog.dom.classlist.enable( this.domElement, 'ui-hidden', true );
};


hlc.controllers.AlbumController.prototype.onPlay = function(e){

	this._crossfadeTimer.start();

	this.dispatchEvent( 'play' );
};


hlc.controllers.AlbumController.prototype.onPause = function(e){

	this._crossfadeTimer.pause();

	this.dispatchEvent( 'pause' );
};


hlc.controllers.AlbumController.prototype.onSongChanged = function(e){

	if(this._isAtSection) {

		this._crossfadeDelay.start();

		this.albumPlayer.getCurrentSong().activate();
		this.albumPlayer.play();
	}
};


hlc.controllers.AlbumController.prototype.onScrollFinish = function(e){

	if(e.albumSection === this) {

		this._isAtSection = true;

		// play song
		this.albumPlayer.getCurrentSong().activate();
		this.albumPlayer.activate();
		this.albumPlayer.play();

		if(e.songId) this.albumPlayer.gotoSongById( e.songId );

		//
		//hlc.main.views.footer.setPhotographyCopyright(this._currentArtwork['copyright']);

	}else {

		this._isAtSection = false;

		// stop song
		this.albumPlayer.stop();
		this.albumPlayer.getCurrentSong().deactivate();
		this.albumPlayer.deactivate();

		this.onPause();

		// stop crossfade
		this._crossfadeDelay.stop();
		this._crossfadeTimer.pause();
	}
};


hlc.controllers.AlbumController.prototype.onNavigate = function(e){
	// if not at this album section, don't handle deeplink navigation
	if(!this._isAtSection) return;

	// check if the token contains album id and song id
	var tokens = e.token.split('/');
	if(tokens[tokens.length - 1] == '') tokens.pop();

	if(tokens[0] === 'album' && tokens.length === 3) {
		var albumId = tokens[1];
		var songId = tokens[2];

		if(this.albumModel.albumId === albumId) {
			this.albumPlayer.gotoSongById( songId );
		}
	}
};


hlc.controllers.AlbumController.CROSSFADE_DURATION = 30000;