goog.provide('hlc.views.mastheadpages.MastheadPage');

goog.require('goog.events.EventTarget');
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

  this._url = url;
  this._request = new goog.net.XhrIo();
};
goog.inherits(hlc.views.mastheadpages.MastheadPage, goog.events.EventTarget);


hlc.views.mastheadpages.MastheadPage.prototype.load = function(){
	if(this._request && !this._request.isActive()) {

		goog.events.listenOnce(this._request, "complete", this.onAjaxCallback, false, this);
		this._request.send(this._url);

	}else if(!this._request) {

		this.onLoaded();
		
	}
};


hlc.views.mastheadpages.MastheadPage.prototype.cancel = function(){
	if(this._request && this._request.isActive()) {
		goog.events.unlisten(this._request, "complete", this.onAjaxCallback, false, this);
		this._request.abort();
	}
};


hlc.views.mastheadpages.MastheadPage.prototype.getOffsetLeft = function(){
	return this.domElement.offsetLeft;
};


hlc.views.mastheadpages.MastheadPage.prototype.onLoaded = function(){
	if(this._request) {
		this._request.dispose();
		this._request = null;
	}

	var ev = {
		type: hlc.views.MastheadSection.EventType.PAGE_LOADED
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