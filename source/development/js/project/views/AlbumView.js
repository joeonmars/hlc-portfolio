goog.provide('hlc.views.AlbumView');

goog.require('goog.events.EventHandler');
goog.require('goog.color');

/**
 * @constructor
 */
hlc.views.AlbumView = function( albumController ){

	hlc.views.AlbumView.MAX_TEXTURE = Math.max(hlc.views.AlbumView.MAX_TEXTURE, albumController.albumIndex * 2);

	this._controller = albumController;

	this._renderTexture = new PIXI.RenderTexture(0, 0);
	this._renderSprite = new PIXI.Sprite( this._renderTexture );

	this._artworkContainer = new PIXI.DisplayObjectContainer();

	this._renderContainer = new PIXI.DisplayObjectContainer();
	this._renderContainer.addChild( this._artworkContainer );

	if(!hlc.views.AlbumView.GRADIENT_TEXTURE) {

		var resX = 1024;
		var resY = 1024;

		var canvas = goog.dom.createDom('canvas');
		canvas.width = resX;
		canvas.height = resY;
		var ctx = canvas.getContext("2d");

		var grd = ctx.createRadialGradient(resX/2, resY/2, 0, resX/2, resY/2, resX*.65);
		grd.addColorStop(0, 'rgba(120, 135, 160, 0.6)');
		grd.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
		ctx.fillStyle = grd;
		ctx.fillRect(0, 0, resX, resY);

		hlc.views.AlbumView.GRADIENT_TEXTURE = PIXI.Texture.fromCanvas( canvas );
	}

	this._gradientSprite = new PIXI.Sprite( hlc.views.AlbumView.GRADIENT_TEXTURE );
	this._renderContainer.addChild( this._gradientSprite );

	this._eventHandler = new goog.events.EventHandler(this);
	this._eventHandler.listen( this._controller, hlc.events.EventType.CROSSFADE, this.onCrossfade, false, this );
};


hlc.views.AlbumView.prototype.getRenderSprite = function(){

	return this._renderSprite;
};


hlc.views.AlbumView.prototype.addArtworkSprite = function( sprite, id ){

	this._artworkContainer.addChild( sprite );

	hlc.views.AlbumView.ArtworkSpriteCache[id] = hlc.views.AlbumView.ArtworkSpriteCache[id] || [];
	hlc.views.AlbumView.ArtworkSpriteCache[id].push( sprite );

	return sprite;
};


hlc.views.AlbumView.prototype.removeArtworkSprite = function( sprite ){

	this._artworkContainer.removeChild( sprite );
	
	var sprites = goog.object.findValue(hlc.views.AlbumView.ArtworkSpriteCache, function(sprites, id) {
		return goog.array.contains(sprites, sprite);
	});

	goog.array.remove( sprites, sprite );

	if(sprites.length === 0) {
		goog.object.clear( hlc.views.AlbumView.ArtworkSpriteCache, sprites );
	}

	return sprite;
};


hlc.views.AlbumView.prototype.render = function( scrollRatio, numAlbums ){

	var topRatio = this._controller.albumIndex / numAlbums;
	var bottomRatio = (this._controller.albumIndex + 1) / numAlbums;

	var a = goog.math.lerp( 0, 1, (scrollRatio - topRatio) / (bottomRatio - topRatio) );
	a = goog.math.clamp( a, -1, 1 );

	var c = Math.round( 255 * (1 - Math.abs(a) * .8) ); //each RGB channel
	this._renderSprite.tint = 256 * 256 * c + 256 * c + c;

	this._renderTexture.clear();
	this._renderTexture.render( this._renderContainer );
};


hlc.views.AlbumView.prototype.resize = function( size ){

	this._renderTexture.resize( size.width, size.height );
	this._renderSprite.y = this._controller.albumIndex * size.height;

	this._gradientSprite.width = size.width;
	this._gradientSprite.height = size.height;

	goog.array.forEach(this._artworkContainer.children, function(sprite) {
		this.coverFit( sprite, true );
	}, this);
};


hlc.views.AlbumView.prototype.coverFit = function( sprite, center ){

  var textureWidth = sprite.texture.width;
  var textureHeight = sprite.texture.height;

  var viewWidth = this._renderTexture.width;
  var viewHeight = this._renderTexture.height;
  var viewRatio = viewWidth / viewHeight;

  var textureRatio = textureWidth / textureHeight;

  var scaledWidth, scaledHeight;

  if (viewRatio > textureRatio) {

    scaledWidth = viewWidth;
    scaledHeight = scaledWidth / textureRatio;

  } else {

    scaledHeight = viewHeight;
    scaledWidth = scaledHeight * textureRatio;
  }

  sprite.width = scaledWidth;
  sprite.height = scaledHeight;

  if(center) {
  	sprite.x = (viewWidth - scaledWidth) / 2;
  	sprite.y = (viewHeight - scaledHeight) / 2;
  }

  return sprite;
};


hlc.views.AlbumView.prototype.onCrossfade = function(e){

	// first check if a texture of the id already exists for re-use
	// otherwise create and cache the texture with the id
	var id = e.img.getAttribute('data-id');
	var texture = PIXI.TextureCache[ id ];

	if(!texture) {
		// check if the number of textures will overflow,
		// destroy unused if necessary
		var numTextures = goog.object.getCount(PIXI.TextureCache);

		if(numTextures >= hlc.views.AlbumView.MAX_TEXTURE) {

			// find the texture not used in current sprites
			goog.object.findValue(PIXI.TextureCache, function(texture, id) {

				var notActive = !goog.object.containsKey(hlc.views.AlbumView.ArtworkSpriteCache, id);

				if(notActive) {
					PIXI.Texture.removeTextureFromCache( texture, id );
					texture.destroy( true );
				}

				return notActive;
			});
		}

		// create and cache new texture
		var baseTexture = new PIXI.BaseTexture( e.img );
		texture = new PIXI.Texture( baseTexture );
		PIXI.Texture.addTextureToCache( texture, id );
	}

	var artworkSprite = this.addArtworkSprite( new PIXI.Sprite(texture), id );
	this.coverFit( artworkSprite, true );

	//console.log('crossfade:', e.img, this._controller.albumIndex);
	//console.log(PIXI.TextureCache);
};


hlc.views.AlbumView.GRADIENT_TEXTURE = null;

hlc.views.AlbumView.MAX_TEXTURE = 0;

hlc.views.AlbumView.ArtworkSpriteCache = {
	// id{String}: sprites{Array}
};