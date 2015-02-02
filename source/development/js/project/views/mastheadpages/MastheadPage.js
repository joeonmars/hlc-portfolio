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
  this._animateOutTweener = new TimelineMax();
};
goog.inherits(hlc.views.mastheadpages.MastheadPage, goog.events.EventTarget);


hlc.views.mastheadpages.MastheadPage.prototype.show = function(){
	goog.style.showElement(this.domElement, true);

	if(this._isPageElementsCreated) {
		this.activate();
		this._animateInTweener.restart();
	}
};

hlc.views.mastheadpages.MastheadPage.prototype.hide = function(){
	goog.style.showElement(this.domElement, false);

	if(this._isPageElementsCreated) {
		this.deactivate();
	}
};


hlc.views.mastheadpages.MastheadPage.prototype.activate = function(){

};


hlc.views.mastheadpages.MastheadPage.prototype.deactivate = function(){

	this._eventHandler.removeAll();
};


hlc.views.mastheadpages.MastheadPage.prototype.load = function(){

	if(this._request && !this._request.isActive()) {

		this._eventHandler.listenOnce(this._request, "complete", this.onAjaxCallback, false, this);
		this._request.send(this._url);

	}else if(!this._request) {

		this.onLoaded();

	}
};


hlc.views.mastheadpages.MastheadPage.prototype.cancel = function(){

	if(this._request && this._request.isActive()) {
		
		this._eventHandler.unlisten(this._request, "complete", this.onAjaxCallback, false, this);
		this._request.abort();
	}
};


hlc.views.mastheadpages.MastheadPage.prototype.createPageElements = function(){
	this._isPageElementsCreated = true;
};


hlc.views.mastheadpages.MastheadPage.prototype.onLoaded = function(){
	if(this._request) {
		this._request.dispose();
		this._request = null;
	}

	if(!this._isPageElementsCreated) {
		this.createPageElements();
		this.activate();
		this._animateInTweener.restart();
	}

	var ev = {
		type: hlc.views.MastheadSection.EventType.PAGE_LOADED,
		title: this.title,
		token: this.token
	};

	this.dispatchEvent(ev);
};


hlc.views.mastheadpages.MastheadPage.prototype.onAjaxCallback = function(e){
	if(this._request.isSuccess()) {

		var responseText = this._request.getResponseText();
		this.domElement.innerHTML = responseText;

		this.onLoaded();

	}else {

		console.log(this._request.getLastError(), this);

	}
};


hlc.views.mastheadpages.MastheadPage.prototype.onResize = function(e){

};