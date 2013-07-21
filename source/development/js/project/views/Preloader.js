goog.provide('hlc.views.Preloader');

goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.dom.classes');
goog.require('goog.net.XhrIo');
goog.require('goog.net.ImageLoader');

/**
 * @constructor
 */
hlc.views.Preloader = function(){
  goog.base(this);

  this._isLoaded = false;

  // sitemap json loader
  this._sitemapRequest = new goog.net.XhrIo();
  this._sitemap = null;

	// image loader
	this._imageLoader = new goog.net.ImageLoader();
	goog.events.listen(this._imageLoader, goog.events.EventType.LOAD, this.onImageLoad, false, this);
	goog.events.listen(this._imageLoader, goog.net.EventType.COMPLETE, this.onImageComplete, false, this);

	goog.array.forEach(hlc.main.data.preloadAssets, function(url) {
		this._imageLoader.addImage(goog.string.getRandomString(), url);
	}, this);

	// assets holder
	this._assets = {};
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
	return this._isLoaded;
};


hlc.views.Preloader.prototype.onSitemapRequested = function(e){
	if(this._sitemapRequest.isSuccess()) {

		var responseText = this._sitemapRequest.getResponseText();
		this._sitemap = JSON.parse(responseText);

		this._assets.sitemap = this._sitemap;

		this._imageLoader.start();

	}else {

		console.log(this._sitemapRequest.getLastError(), this);

	}
};


hlc.views.Preloader.prototype.onImageLoad = function(e){
	this._assets[e.target.id] = e.target.src;
};


hlc.views.Preloader.prototype.onImageComplete = function(e){
	this.onLoadComplete();
};


hlc.views.Preloader.prototype.onLoadComplete = function(){
	this._isLoaded = true;

	this.dispatchEvent({type: goog.net.EventType.COMPLETE, assets: this._assets});
};


hlc.views.Preloader.prototype.onResize = function(e){

};