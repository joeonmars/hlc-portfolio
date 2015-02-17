goog.provide('hlc.views.AlbumScrollView');

goog.require('goog.events.EventHandler');
goog.require('goog.math.Size');
goog.require('hlc.views.AlbumView');

/**
 * @constructor
 * A PIXI.JS based renderer wrapper
 */
hlc.views.AlbumScrollView = function( controller ){

	this.resolution = new goog.math.Size();

	this._controller = controller;
	this._eventHandler = new goog.events.EventHandler(this);

	this._renderer = null;
	this._stage = null;
	this._albumsContainer = null;
	this._albumViews = null;
};


hlc.views.AlbumScrollView.prototype.init = function(){

	this._renderer = new PIXI.autoDetectRenderer(0, 0, {
		view: goog.dom.getElement('albums-view')
	});

	this._stage = new PIXI.Stage(0x000000);

	this._albumsContainer = new PIXI.DisplayObjectContainer();
	this._stage.addChild( this._albumsContainer );

	//loop through controller's albums sections and create AlbumView(s)
	this._albumViews = goog.array.map(this._controller.albumSections, function(albumSection) {

		var albumView = new hlc.views.AlbumView( albumSection );
		this._albumsContainer.addChild( albumView.getRenderSprite() );

		return albumView;
	}, this);
};


hlc.views.AlbumScrollView.prototype.activate = function(){

	this._eventHandler.listen( this._controller, goog.events.EventType.RESIZE, this.onResize, false, this );
	TweenMax.ticker.addEventListener('tick', this.render, this);
};


hlc.views.AlbumScrollView.prototype.deactivate = function(){

	this._eventHandler.removeAll();
	TweenMax.ticker.removeEventListener('tick', this.render, this);
};


hlc.views.AlbumScrollView.prototype.render = function(){

	var i, l = this._albumViews.length;
	for(i = 0; i < l; i++) {
		this._albumViews[i].render();
	}

	var totalHeight = this.resolution.height * this._albumViews.length;
	this._albumsContainer.y = - this._controller.getScrollRatio() * totalHeight;

	this._renderer.render( this._stage );
};


hlc.views.AlbumScrollView.prototype.onResize = function(e){

	var viewSize = e.size;

	if(goog.math.Size.equals(this.resolution, viewSize)) {
		return;
	}

	var viewAspectRatio = viewSize.aspectRatio();
	this.resolution.width = hlc.views.AlbumScrollView.RESOLUTION;
	this.resolution.height = Math.round( this.resolution.width / viewAspectRatio );

	this._renderer.resize( this.resolution.width, this.resolution.height );

	// resize album views
	goog.array.forEach( this._albumViews, function(albumView) {
		albumView.resize( this.resolution );
	}, this);
};


hlc.views.AlbumScrollView.RESOLUTION = 1024;