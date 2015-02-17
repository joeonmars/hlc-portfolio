goog.provide('hlc.views.AlbumScrollView');

goog.require('goog.events.EventHandler');
goog.require('goog.math.Size');

/**
 * @constructor
 * A PIXI.JS based render view for album scroller
 */
hlc.views.AlbumScrollView = function( controller ){

	goog.base(this);

	this.resolution = new goog.math.Size();

	this._controller = controller;
	this._eventHandler = new goog.events.EventHandler(this);

	this._renderer = null;
	this._stage = null;
	this._albumsContainer = null;
};
goog.inherits(hlc.views.AlbumScrollView, goog.events.EventTarget);


hlc.views.AlbumScrollView.prototype.init = function(){

	this._renderer = new PIXI.WebGLRenderer(0, 0, {
		view: goog.dom.getElement('albums-view')
	});

	this._stage = new PIXI.Stage(0x000000);

	this._albumsContainer = new PIXI.DisplayObjectContainer();
	this._stage.addChild( this._albumsContainer );

	//TODO: loop through controller's albums elements and create AlbumView(s)
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

	this._renderer.render( this._stage );
};


hlc.views.AlbumScrollView.prototype.onResize = function( e ){

	var viewSize = e.size;

	if(goog.math.Size.equals(this.resolution, viewSize)) {
		return;
	}

	var viewAspectRatio = viewSize.aspectRatio();
	this.resolution.width = Math.round( Math.min(viewSize.width, hlc.views.AlbumScrollView.MAX_RESOLUTION) );
	this.resolution.height = Math.round( this.resolution.width / viewAspectRatio );

	this._renderer.resize( this.resolution.width, this.resolution.height );
};


hlc.views.AlbumScrollView.MAX_RESOLUTION = 1024;
hlc.views.AlbumScrollView.MAX_TEXTURE = 10;