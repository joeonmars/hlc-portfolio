goog.provide('hlc.views.AlbumView');

goog.require('goog.events.EventHandler');

/**
 * @constructor
 */
hlc.views.AlbumView = function( albumController ){

	hlc.views.AlbumView.MAX_TEXTURE = Math.max(hlc.views.AlbumView.MAX_TEXTURE, albumController.albumIndex * 2);

	this._controller = albumController;

	this._renderTexture = new PIXI.RenderTexture(0, 0);
	this._renderSprite = new PIXI.Sprite( this._renderTexture );

	this._artworkContainer = new PIXI.DisplayObjectContainer();

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


hlc.views.AlbumView.prototype.render = function(){

	this._renderTexture.render( this._artworkContainer );
};


hlc.views.AlbumView.prototype.resize = function( size ){

	this._renderTexture.resize( size.width, size.height );
	this._renderSprite.y = this._controller.albumIndex * size.height;
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


hlc.views.AlbumView.MAX_TEXTURE = 0;

hlc.views.AlbumView.ArtworkSpriteCache = {
	// id{String}: sprites{Array}
};