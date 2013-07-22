goog.provide('hlc.views.Playlist');

goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.dom.classes');

/**
 * @constructor
 */
hlc.views.Playlist = function(){
  goog.base(this);

  this.domElement = goog.dom.getElement('playlist');
  this.parentDomElement = goog.dom.getParentElement(this.domElement);

  this.middleDomElement = goog.dom.query('.middle', this.domElement)[0];
  this.viewportDomElement = goog.dom.query('.viewport', this.domElement)[0];
  this.colorOverlayDomElement = goog.dom.query('.colorOverlay', this.parentDomElement)[0];
  this.bottomGradientDomElement = goog.dom.query('.gradient', this.domElement)[1];

  this.albumDoms = goog.dom.query('.middle .album', this.domElement);
  this.songButtons = goog.dom.query('.middle a', this.domElement);

  this._middleTweener = null;

  this.isClosed = true;
  goog.style.showElement(this.parentDomElement, false);
};
goog.inherits(hlc.views.Playlist, goog.events.EventTarget);


hlc.views.Playlist.prototype.init = function(){
	goog.events.listen(this, 'resize', this.onResize, false, this);
	hlc.main.controllers.windowController.addDispatcher(this);

	hlc.main.controllers.navigationController.addDispatcher(this);
	goog.events.listen(this, goog.history.EventType.NAVIGATE, this.onNavigate, false, this);

	this.hide();
};


hlc.views.Playlist.prototype.isTweening = function(){
	return TweenMax.isTweening( this.domElement );
};


hlc.views.Playlist.prototype.show = function(){
	this.isClosed = false;

	goog.style.showElement(this.parentDomElement, true);

	this.onResize();

	goog.Timer.callOnce(function() {
		goog.style.setOpacity(this.colorOverlayDomElement, 1);
	}, 100, this);

	if(this._middleTweener) this._middleTweener.kill();
	this._middleTweener = TweenMax.to(this.middleDomElement, 1.5, {
		width: 360,
		ease: Strong.easeInOut
	});

	TweenMax.to(this.domElement, 1.5, {
		opacity: 1,
		ease: Quad.easeInOut,
		onStart: function() {
			this.dispatchEvent({type: hlc.views.Playlist.EventType.SHOW_START});
		},
		onStartScope: this,
		onComplete: function() {
			this.dispatchEvent({type: hlc.views.Playlist.EventType.SHOW_FINISH});
		},
		onCompleteScope: this
	});

	goog.array.forEach(this.songButtons, function(songButton) {
		goog.events.listen(songButton, 'click', this.onClickSongButton, false, this);
	}, this);
};


hlc.views.Playlist.prototype.hide = function(){
	goog.Timer.callOnce(function() {
		goog.style.setOpacity(this.colorOverlayDomElement, 0);
	}, 400, this);

	if(this._middleTweener) this._middleTweener.kill();
	this._middleTweener = TweenMax.to(this.middleDomElement, 1.5, {
		width: 0,
		ease: Strong.easeInOut
	});

	TweenMax.to(this.domElement, 1.5, {
		opacity: 0,
		ease: Quad.easeInOut,
		onStart: function() {
			this.dispatchEvent({type: hlc.views.Playlist.EventType.HIDE_START});
		},
		onStartScope: this,
		onComplete: function() {
			goog.style.showElement(this.parentDomElement, false);
			this.isClosed = true;

			this.dispatchEvent({type: hlc.views.Playlist.EventType.HIDE_FINISH});
		},
		onCompleteScope: this
	});

	goog.array.forEach(this.songButtons, function(songButton) {
		goog.events.unlisten(songButton, 'click', this.onClickSongButton, false, this);
	}, this);
};


hlc.views.Playlist.prototype.toggle = function(){
	if(this.isClosed) {
		this.show();
	}else {
		this.hide();
	}
};


hlc.views.Playlist.prototype.onClickSongButton = function(e){
	e.preventDefault();

	var token = e.currentTarget.getAttribute('href');
	hlc.main.controllers.navigationController.setToken( token );
};


hlc.views.Playlist.prototype.onNavigate = function(e){
	// check if the token contains album id and song id
	var tokens = e.token.split('/');
	if(tokens[tokens.length - 1] == '') tokens.pop();

	if(tokens[0] === 'album' && tokens.length === 3) {
		var albumId = tokens[1];
		var songId = tokens[2];

		var albumDom = goog.dom.query('.middle [data-id="' + albumId + '"]', this.domElement)[0];
		var songButton = goog.dom.query('[data-id="' + songId + '"]', albumDom)[0];

		if(this._currentSongButton) goog.dom.classes.remove(this._currentSongButton, 'active');

		this._currentSongButton = songButton;
		
		goog.dom.classes.add(this._currentSongButton, 'active');
	}
};


hlc.views.Playlist.prototype.onResize = function(e){
	var mainViewportSize = e ? e.mainViewportSize : hlc.main.controllers.windowController.getMainViewportSize();

	goog.style.setStyle(this.parentDomElement, 'height', mainViewportSize.height + 'px');

	var bottomGradientHeight = goog.style.getSize(this.bottomGradientDomElement).height;
	goog.style.setStyle(this.bottomGradientDomElement, 'top', mainViewportSize.height - bottomGradientHeight + 'px');
};


hlc.views.Playlist.EventType = {
	SHOW_START: 'show_start',
	HIDE_START: 'hide_start',
	SHOW_FINISH: 'show_finish',
	HIDE_FINISH: 'hide_finish'
};