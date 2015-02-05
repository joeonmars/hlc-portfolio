goog.provide( 'hlc.views.Preloader' );

goog.require( 'goog.dom' );
goog.require( 'goog.events.EventTarget' );
goog.require( 'hlc.views.Loader' );


/** @constructor */
hlc.views.Preloader = function() {

	var bulkAssets = {
		'sitemap': hlc.Url.ORIGIN + 'sitemap.html'
	};
	
	var imageAssets = {};

	goog.object.forEach(hlc.main.data.preloadAssets, function(url, id) {
		goog.object.add(imageAssets, id, url);
	});

	goog.base(this, bulkAssets, imageAssets, 4000);

	this.assets = {};
	this._domElement = goog.dom.getElement('preloader');
	this._progressEl = goog.dom.query('.progress', this._domElement)[0];

	// animation
	var fadeInTweener = TweenMax.to(this._domElement, 1, {
		opacity: 1,
		display: 'block',
		ease: Quad.easeOut
	});

	this._animateInTweener.add(fadeInTweener);

	var fadeOutTweener = TweenMax.to(this._domElement, 1, {
		opacity: 0,
		display: 'none',
		ease: Quad.easeOut
	});

	this._animateOutTweener.add(fadeOutTweener);
};
goog.inherits(hlc.views.Preloader, hlc.views.Loader);


hlc.views.Preloader.prototype.init = function(){
	goog.events.listen(this, 'resize', this.onResize, false, this);
	hlc.main.controllers.windowController.addDispatcher(this);
};


hlc.views.Preloader.prototype.onProgress = function(e) {
	goog.base(this, 'onProgress', e);
	
	this._progressEl.innerHTML = Math.round(e.progress * 100);
};


hlc.views.Preloader.prototype.onImageLoad = function(e) {

	goog.base(this, 'onImageLoad', e);

	this.assets[e.target.id] = e.target;
};


hlc.views.Preloader.prototype.onBulkSuccess = function(e) {
	var responseText = e.target.getResponseTexts();
	this.assets['sitemap'] = JSON.parse(responseText);

	goog.base(this, 'onBulkSuccess', e);
};


hlc.views.Preloader.prototype.onResize = function(e){

};