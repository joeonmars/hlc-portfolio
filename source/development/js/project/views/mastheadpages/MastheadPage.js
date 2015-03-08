goog.provide('hlc.views.mastheadpages.MastheadPage');

goog.require('goog.events.EventTarget');
goog.require('goog.events.EventHandler');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.net.XhrIo');

/**
 * @constructor
 */
hlc.views.mastheadpages.MastheadPage = function(domElement, url, title){
  goog.base(this);

  this.setParentEventTarget( hlc.main.views.mastheadSection );

  this.domElement = domElement;
  this.parentDomElement = goog.dom.getParentElement(this.domElement);

  this.title = title;
  this.token = this.domElement.getAttribute('data-token');

  this._url = url;
  this._request = new goog.net.XhrIo();

  this._isPageElementsCreated = false;

  this._eventHandler = new goog.events.EventHandler(this);

  this._animateInTweener = new TimelineMax();

  this._animateOutTweener = new TimelineMax({
  	'onComplete': this.hide,
  	'onCompleteScope': this
  });

  var interval = 1000/30;
  var loadDuration = 2000;

  this._loadProgressCounter = new goog.Timer(interval);
  this._loadStep = loadDuration / interval / loadDuration;
  this._loadAnimationProgress = 0;
  this._loadComplete = false;
  this._loadSuccess = false;
  this._responseText = null;
  this._loadCompleteDelay = null;
};
goog.inherits(hlc.views.mastheadpages.MastheadPage, goog.events.EventTarget);


hlc.views.mastheadpages.MastheadPage.prototype.show = function(){

	goog.style.showElement(this.domElement, true);
};


hlc.views.mastheadpages.MastheadPage.prototype.hide = function(){

	goog.style.showElement(this.domElement, false);
};


hlc.views.mastheadpages.MastheadPage.prototype.animateIn = function(){

	this.show();

	if(this._animateInTweener.getChildren().length > 0) {
		this._animateInTweener.restart();
	}

	if(this._isPageElementsCreated) {
		this.activate();
	}
};


hlc.views.mastheadpages.MastheadPage.prototype.animateOut = function(){

	if(this._animateOutTweener.getChildren().length > 0) {
		this._animateOutTweener.restart();
	}else {
		this.hide();
	}

	this.deactivate();
};


hlc.views.mastheadpages.MastheadPage.prototype.activate = function(){

	this._eventHandler.listen(window, goog.events.EventType.RESIZE, this.resize, false, this);
};


hlc.views.mastheadpages.MastheadPage.prototype.deactivate = function(){

	this._eventHandler.removeAll();
};


hlc.views.mastheadpages.MastheadPage.prototype.load = function(){

	if(this._request && !this._request.isActive()) {

		this._eventHandler.listen(this._request, goog.events.EventType.READYSTATECHANGE, this.onRequestReadyStateChange, false, this);
		this._eventHandler.listenOnce(this._request, goog.net.EventType.COMPLETE, this.onRequestComplete, false, this);
		this._request.send(this._url);

		this._loadProgressCounter.start();
		this._eventHandler.listen(this._loadProgressCounter, goog.Timer.TICK, this.onLoadProgressTick, false, this);

	}else if(!this._request) {

		this.onLoaded();
	}
};


hlc.views.mastheadpages.MastheadPage.prototype.cancel = function(){

	if(this._request && this._request.isActive()) {
		
		this._request.abort();
	}
};


hlc.views.mastheadpages.MastheadPage.prototype.createPageElements = function(){

	this._isPageElementsCreated = true;
};


hlc.views.mastheadpages.MastheadPage.prototype.resize = function(){

};


hlc.views.mastheadpages.MastheadPage.prototype.onLoaded = function(){

	if(!this._isPageElementsCreated) {
		this.createPageElements();
		this.animateIn();
	}

	var ev = {
		type: hlc.views.MastheadSection.EventType.PAGE_LOADED,
		title: this.title,
		token: this.token
	};

	this.dispatchEvent(ev);
};


hlc.views.mastheadpages.MastheadPage.prototype.onRequestReadyStateChange = function(e){

	this._loadProgress = e.target.getReadyState() / goog.net.XmlHttp.ReadyState.COMPLETE;
};


hlc.views.mastheadpages.MastheadPage.prototype.onRequestComplete = function(e){

	this._loadComplete = this._request.isComplete();
	this._loadSuccess = this._request.isSuccess();
	this._responseText = this._request.getResponseText();
};


hlc.views.mastheadpages.MastheadPage.prototype.onLoadComplete = function(e){

	// dispose load
	this._eventHandler.unlisten(this._loadProgressCounter, goog.Timer.TICK, this.onLoadProgressTick, false, this);
	this._loadProgressCounter.stop();
	this._loadProgressCounter.dispose();
	this._loadProgressCounter = null;

	if(this._request) {
		this._request.dispose();
		this._request = null;
	}

	// handle load
	if(this._loadSuccess) {

		var frag = goog.dom.htmlToDocumentFragment( this._responseText );
		goog.dom.appendChild(this.domElement, frag);

		this.onLoaded();

	}else {

		console.log(this._request.getLastError(), this);
	}
};


hlc.views.mastheadpages.MastheadPage.prototype.onLoadProgressTick = function(e){

	this._loadAnimationProgress = Math.min(this._loadAnimationProgress + this._loadStep, this._loadProgress);

	//console.log('page load progress: ' + this._loadAnimationProgress);

	if(this._loadAnimationProgress === 1) {

		if(this._loadComplete && this._loadSuccess) {
			this._loadCompleteDelay = this._loadCompleteDelay || goog.Timer.callOnce( this.onLoadComplete, 1000, this );
		}
	}
};