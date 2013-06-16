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

  this.viewportDomElement = goog.dom.query('.viewport', this.domElement)[0];
  this.colorOverlayDomElement = goog.dom.query('.colorOverlay', this.parentDomElement)[0];

  this.isClosed = false;

  this._viewportTweener = null;
};
goog.inherits(hlc.views.Playlist, goog.events.EventTarget);


hlc.views.Playlist.prototype.init = function(){
	goog.events.listen(this, 'resize', this.onResize, false, this);
	hlc.main.controllers.windowController.addDispatcher(this);

	this.hide();
};


hlc.views.Playlist.prototype.show = function(){
	this.isClosed = false;

	goog.style.showElement(this.parentDomElement, true);

	goog.Timer.callOnce(function() {
		goog.style.setOpacity(this.colorOverlayDomElement, 1);
	}, 100, this);

	if(this._viewportTweener) this._viewportTweener.kill();
	this._viewportTweener = TweenMax.to(this.viewportDomElement, 1.5, {
		width: 360,
		ease: Strong.easeInOut
	});

	TweenMax.to(this.domElement, 1.5, {
		opacity: 1
	});

	this.dispatchEvent({type: hlc.views.Playlist.EventType.SHOW});
};


hlc.views.Playlist.prototype.hide = function(){
	goog.Timer.callOnce(function() {
		goog.style.setOpacity(this.colorOverlayDomElement, 0);
	}, 400, this);

	if(this._viewportTweener) this._viewportTweener.kill();
	this._viewportTweener = TweenMax.to(this.viewportDomElement, 1.5, {
		width: 0,
		ease: Strong.easeInOut,
		onComplete: function() {
			goog.style.showElement(this.parentDomElement, false);
			this.isClosed = true;

			this.dispatchEvent({type: hlc.views.Playlist.EventType.HIDE});
		},
		onCompleteScope: this
	});

	TweenMax.to(this.domElement, 1.5, {
		opacity: 0,
		ease: Strong.easeIn
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
	goog.style.setStyle(this.parentDomElement, 'height', e.mainViewportSize.height + 'px');
};


hlc.views.Playlist.EventType = {
	SHOW: 'show',
	HIDE: 'hide'
};