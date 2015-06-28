goog.provide( 'hlc.views.MediaPlayer' );

goog.require( 'goog.events.EventTarget' );
goog.require( 'goog.events' );
goog.require( 'goog.dom' );
goog.require( 'goog.dom.query' );
goog.require( 'goog.dom.classes' );
goog.require( 'goog.userAgent' );
goog.require( 'hlc.views.mediaplayercontrols.ProgressControl' );
goog.require( 'hlc.views.mediaplayercontrols.SoundControl' );
goog.require( 'hlc.views.mediaplayercontrols.SoundVisualizer' );

/**
 * @constructor
 */
hlc.views.MediaPlayer = function() {
	goog.base( this );

	this.domElement = goog.dom.getElement( 'media-player' );
	this.parentDomElement = goog.dom.getParentElement( this.domElement );

	this._fullColumn = goog.dom.getElementByClass( 'fullColumn', this.domElement );
	this._canvasDom = goog.dom.query( 'canvas', this._fullColumn )[ 0 ];
	this._playbackControlDom = goog.dom.getElementByClass( 'playbackControl', this.domElement );
	this._soundControlDom = goog.dom.getElementByClass( 'soundControl', this.domElement );
	this._progressControlDom = goog.dom.getElementByClass( 'progressControl', this.domElement );

	this._playButton = goog.dom.getElementByClass( 'playButton', this.domElement );
	this._prevButton = goog.dom.getElementByClass( 'prevButton', this.domElement );
	this._nextButton = goog.dom.getElementByClass( 'nextButton', this.domElement );

	this._size = goog.style.getSize( this.domElement );

	this._audio = null;

	this.progressControl = new hlc.views.mediaplayercontrols.ProgressControl( this._progressControlDom );

	this.soundControl = new hlc.views.mediaplayercontrols.SoundControl( this._soundControlDom );

	this.soundVisualizer = new hlc.views.mediaplayercontrols.SoundVisualizer( this._canvasDom );

	goog.style.showElement( this._soundControlDom, !goog.userAgent.MOBILE );

	// register media player to sound controller
	hlc.main.controllers.soundController.addDispatcher( this );
};
goog.inherits( hlc.views.MediaPlayer, goog.events.EventTarget );


hlc.views.MediaPlayer.prototype.init = function() {

	goog.events.listen( this, 'resize', this.resize, false, this );
	hlc.main.controllers.windowController.addDispatcher( this );

	goog.events.listen( hlc.main.controllers.mainScrollController,
		hlc.events.EventType.SCROLL_COMPLETE, this.onScrollFinish, false, this );

	goog.events.listen( this._playButton, 'click', this.onClick, false, this );
	goog.events.listen( this._prevButton, 'click', this.onClick, false, this );
	goog.events.listen( this._nextButton, 'click', this.onClick, false, this );

	goog.events.listen( this, hlc.models.SongModel.EventType.HTML_AUDIO_EVENTS, this.onAudioEvent, false, this );
	goog.events.listen( this, hlc.models.SongModel.EventType.AUDIO_DATA_LOAD, this.onAudioDataLoad, false, this );

	goog.events.listen( hlc.main.views.sidebar, hlc.views.Sidebar.EventType.SLIDING, this.resize, false, this );

	// listen for credits event
	goog.events.listen( hlc.main.views.credits, hlc.events.EventType.ANIMATE_IN_START, this.hide, false, this );
	goog.events.listen( hlc.main.views.credits, hlc.events.EventType.ANIMATE_OUT_START, this.show, false, this );
};


hlc.views.MediaPlayer.prototype.show = function() {
	goog.dom.classes.enable( this.parentDomElement, 'hidePlayer', false );
};


hlc.views.MediaPlayer.prototype.hide = function() {
	goog.dom.classes.enable( this.parentDomElement, 'hidePlayer', true );
};


hlc.views.MediaPlayer.prototype.updateProgress = function() {

	var current = this._audio.currentTime;
	var duration = this._audio.duration;

	var progress;

	if ( !current || !duration ) {

		progress = 0;

	} else {

		progress = current / duration;
	}

	this.progressControl.updateProgress( progress );
	this.soundVisualizer.updateProgress( progress );
};


hlc.views.MediaPlayer.prototype.resize = function() {
	var fullColumnWidth = goog.style.getSize( this._fullColumn ).width;
	var playbackControlsWidth = goog.style.getSize( this._playbackControlDom ).width;
	var soundControlsWidth = goog.userAgent.MOBILE ? 0 : goog.style.getSize( this._soundControlDom ).width;

	var progressControlDomWidth = fullColumnWidth - playbackControlsWidth - soundControlsWidth;
	goog.style.setStyle( this._progressControlDom, 'width', progressControlDomWidth + 'px' );

	this.progressControl.onResize();

	this.soundVisualizer.onResize();
};


hlc.views.MediaPlayer.prototype.onScrollFinish = function( e ) {
	if ( e.scrollPosition === hlc.controllers.MainScrollController.ScrollPosition.MASTHEAD ) {
		this.hide();
	} else {
		this.show();
	}
};


hlc.views.MediaPlayer.prototype.onClick = function( e ) {
	switch ( e.currentTarget ) {
		case this._playButton:
			if ( hlc.main.controllers.soundController.isPaused() ) {
				hlc.main.controllers.soundController.play();
			} else {
				hlc.main.controllers.soundController.pause();
			}
			break;

		case this._prevButton:
			hlc.main.controllers.albumScrollController.currentAlbumSection.albumPlayer.prevSong( true );
			break;

		case this._nextButton:
			hlc.main.controllers.albumScrollController.currentAlbumSection.albumPlayer.nextSong( true );
			break;

		default:
			break;
	}
};


hlc.views.MediaPlayer.prototype.onAudioEvent = function( e ) {

	this._audio = e.audio;

	switch ( e.type ) {
		case 'play':
			goog.dom.classes.remove( this._playButton, 'pause' );
			goog.fx.anim.registerAnimation( this );
			break;

		case 'pause':
			goog.dom.classes.add( this._playButton, 'pause' );
			goog.fx.anim.unregisterAnimation( this );
			break;

		case 'timeupdate':
			if ( this._audio.paused ) {
				this.updateProgress();
			}
			break;

		default:
			break;
	}
};


hlc.views.MediaPlayer.prototype.onAudioDataLoad = function( e ) {
	this.soundVisualizer.draw( e.audioData );
};


hlc.views.MediaPlayer.prototype.onAnimationFrame = function( now ) {

	this.updateProgress();
};