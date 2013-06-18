goog.provide('hlc.views.Preloader');

goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.dom.classes');
goog.require('goog.net.XhrIo');

/**
 * @constructor
 */
hlc.views.Preloader = function(){
  goog.base(this);

  this._sitemapRequest = new goog.net.XhrIo();
  this._isSitemapLoaded = false;

  this._sitemap = null;
};
goog.inherits(hlc.views.Preloader, goog.events.EventTarget);


hlc.views.Preloader.prototype.init = function(){
	goog.events.listen(this, 'resize', this.onResize, false, this);
	hlc.main.controllers.windowController.addDispatcher(this);

	goog.events.listenOnce(this._sitemapRequest, "complete", this.onSitemapRequested, false, this);
};


hlc.views.Preloader.prototype.load = function(){
	var sitemapUrl = hlc.Url.ORIGIN + 'sitemap.html';
	this._sitemapRequest.send(sitemapUrl);
};


hlc.views.Preloader.prototype.isLoaded = function(){
	return this._isSitemapLoaded;
};


hlc.views.Preloader.prototype.onSitemapRequested = function(e){
	if(this._sitemapRequest.isSuccess()) {

		var responseText = this._sitemapRequest.getResponseText();
		this._sitemap = JSON.parse(responseText);

		this._isSitemapLoaded = true;
		
		this.onLoad();

	}else {

		console.log(this._sitemapRequest.getLastError(), this);

	}
};


hlc.views.Preloader.prototype.onLoad = function(){
	// check if both sitemap and main assets is loaded
	if(!this._isSitemapLoaded) return false;

	var assets = {
		sitemap: this._sitemap
	};

	//
	this.dispatchEvent({type: goog.net.EventType.COMPLETE, assets:assets});
};


hlc.views.Preloader.prototype.onResize = function(e){

};