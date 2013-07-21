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

  this._middleTweener = null;

  this.isClosed = true;
  goog.style.showElement(this.parentDomElement, false);
};
goog.inherits(hlc.views.Playlist, goog.events.EventTarget);


hlc.views.Playlist.prototype.init = function(){
	goog.events.listen(this, 'resize', this.onResize, false, this);
	hlc.main.controllers.windowController.addDispatcher(this);

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
};


hlc.views.Playlist.prototype.toggle = function(){
	if(this.isClosed) {
		this.show();
	}else {
		this.hide();
	}
};


hlc.views.Playlist.prototype.onClick = function(e){

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