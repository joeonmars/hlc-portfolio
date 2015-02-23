goog.provide('hlc.views.AlbumView');

goog.require('goog.events.EventHandler');
goog.require('goog.color');
goog.require('hlc.utils');

/**
 * @constructor
 */
hlc.views.AlbumView = function( albumController ){

	hlc.views.AlbumView.MAX_TEXTURE = Math.max(hlc.views.AlbumView.MAX_TEXTURE, albumController.albumIndex * 2);

	this._controller = albumController;

	this._size = null;

	this._tweener = null;
	this._tweeners = [];

	//
	this._renderTexture = new PIXI.RenderTexture(0, 0);
	this._renderSprite = new PIXI.Sprite( this._renderTexture );

	//
	this._artworkContainer = new PIXI.DisplayObjectContainer();

	// cache cover texture
	var coverTextureCache = PIXI.TextureCache['album-cover'];
	var coverImg = hlc.main.assets['album-cover'];
	var coverTexture = coverTextureCache ? coverTextureCache : new PIXI.Texture( new PIXI.BaseTexture( coverImg ) );
	if(!coverTextureCache) {
		PIXI.Texture.addTextureToCache( coverTexture, 'album-cover' );
	}
	this._coverSprite = new PIXI.Sprite( coverTexture );

	//
	this._renderContainer = new PIXI.DisplayObjectContainer();
	this._renderContainer.addChild( this._coverSprite );
	this._renderContainer.addChild( this._artworkContainer );

	//
	this._eventHandler = new goog.events.EventHandler(this);
	this._eventHandler.listen( this._controller, hlc.events.EventType.CROSSFADE, this.onCrossfade, false, this );
	this._eventHandler.listen( this._controller, 'play', this.onPlay, false, this );
	this._eventHandler.listen( this._controller, 'pause', this.onPause, false, this );
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
	
	var id;

	var sprites = goog.object.findValue(hlc.views.AlbumView.ArtworkSpriteCache, function(_sprites, _id) {
		
		var hasSprite = goog.array.contains(_sprites, sprite);

		if(hasSprite) {
			id = _id;
			return true;
		}
	});

	goog.array.remove( sprites, sprite );

	if(sprites.length === 0) {
		goog.object.remove( hlc.views.AlbumView.ArtworkSpriteCache, id );
	}

	return sprite;
};


hlc.views.AlbumView.prototype.render = function( scrollRatio, numAlbums ){

	// dim based on scroll ratio
	var topRatio = this._controller.albumIndex / numAlbums;
	var bottomRatio = (this._controller.albumIndex + 1) / numAlbums;

	var a = goog.math.lerp( 0, 1, (scrollRatio - topRatio) / (bottomRatio - topRatio) );
	a = goog.math.clamp( a, -1, 1 );

	var c = Math.round( 255 * (1 - Math.abs(a) * .9) ); //each RGB channel
	this._renderSprite.tint = 256 * 256 * c + 256 * c + c;

	// parallax
	var croppedRatio = scrollRatio - topRatio;
	var croppedHeight = croppedRatio * this._size.height;
	this._artworkContainer.y = croppedHeight;

	// render to texture
	this._renderTexture.clear();
	this._renderTexture.render( this._renderContainer );
};


hlc.views.AlbumView.prototype.resize = function( size ){

	this._size = size;

	this._renderTexture.resize( size.width, size.height );
	this._renderSprite.y = this._controller.albumIndex * size.height;

	// update cover sprite if on stage
	if(this._coverSprite.parent) {
		hlc.utils.coverFit( this._coverSprite, size.width, size.height );
	}

	// update artwork tweeners
	goog.array.forEach(this._tweeners, function(tweener) {
		this.onArtworkTransitionUpdate( tweener.target );
	}, this);
};


hlc.views.AlbumView.prototype.recycle = function(){

	goog.array.forEachRight(this._tweeners, function(tweener) {

		if(tweener !== this._tweener) {

			var sprite = tweener.target.sprite;
			this.removeArtworkSprite( sprite );

			goog.array.remove(this._tweeners, tweener);
		}
	}, this);
};


hlc.views.AlbumView.prototype.applyTransition = function( sprite, opt_transition ){

	// extract or randomize transition params
	var param = hlc.views.AlbumView.TRANSITION_PARAM;
	var paramX = [ param.LEFT, param.CENTER, param.RIGHT ];
	var paramY = [ param.TOP, param.CENTER, param.BOTTOM ];
	var paramScale = [ param.IN, param.OUT, param.NONE ];

	var paramFromX, paramToX, paramFromY, paramToY, paramToScale;

	if(opt_transition) {

		var transitionParams = opt_transition.replace('from-','').replace('to-','').replace('scale-','').split('-');
		paramFromX = transitionParams[0];
		paramFromY = transitionParams[1];
		paramToX = transitionParams[2];
		paramToY = transitionParams[3];
		paramToScale = transitionParams[4];

	}

	// randomize not defined params
	paramFromX = (!paramFromX || paramFromX === 'random') ? paramX[ goog.math.randomInt(paramX.length) ] : paramFromX;
	paramFromY = (!paramFromY || paramFromY === 'random') ? paramY[ goog.math.randomInt(paramY.length) ] : paramFromY;
	paramToX = (!paramToX || paramToX === 'random') ? paramX[ goog.math.randomInt(paramX.length) ] : paramToX;
	paramToY = (!paramToY || paramToY === 'random') ? paramY[ goog.math.randomInt(paramY.length) ] : paramToY;
	paramToScale = (!paramToScale || paramToScale === 'random') ? paramScale[ goog.math.randomInt(paramScale.length) ] : paramToScale;

	console.log(paramFromX,paramFromY,paramToX,paramToY,paramToScale);

	// set values from params
	var fromX, fromY, toX, toY, fromScale, toScale;

	switch(paramFromX) {

		case param.LEFT:
		fromX = goog.math.uniformRandom(0, .5);
		break;

		case param.RIGHT:
		fromX = goog.math.uniformRandom(.5, 1);
		break;

		case param.CENTER:
		fromX = .5;
		break;
	}

	switch(paramFromY) {

		case param.TOP:
		fromY = goog.math.uniformRandom(0, .5);
		break;

		case param.BOTTOM:
		fromY = goog.math.uniformRandom(.5, 1);
		break;

		case param.CENTER:
		fromY = .5;
		break;
	}

	switch(paramToX) {

		case param.LEFT:
		toX = goog.math.uniformRandom(0, .5);
		break;

		case param.RIGHT:
		toX = goog.math.uniformRandom(.5, 1);
		break;

		case param.CENTER:
		toX = .5;
		break;
	}

	switch(paramToY) {

		case param.TOP:
		toY = goog.math.uniformRandom(0, .5);
		break;

		case param.BOTTOM:
		toY = goog.math.uniformRandom(.5, 1);
		break;

		case param.CENTER:
		toY = .5;
		break;
	}

	switch(paramToScale) {

		case param.IN:
		fromScale = 1;
		toScale = goog.math.uniformRandom(1.2, 1.6);
		break;

		case param.OUT:
		fromScale = goog.math.uniformRandom(1.2, 1.6);
		toScale = 1;
		break;

		case param.NONE:
		fromScale = 1;
		toScale = 1;
		break;
	}

	// update anchor
	sprite.anchor.set( fromX, fromY );

	// make tweener
	var prop = {
		sprite: sprite,
		alpha: 0,
		x: fromX,
		y: fromY,
		scale: fromScale,
		fromAlpha: 0,
		toAlpha: 1,
		fromX: fromX,
		toX: toX,
		fromY: fromY,
		toY: toY,
		fromScale: fromScale,
		toScale: toScale
	};

	var tweener = TweenMax.to(prop, hlc.controllers.AlbumController.CROSSFADE_DURATION * 1.5 / 1000, {
		alpha: prop.toAlpha,
		x: prop.toX,
		y: prop.toY,
		scale: prop.toScale,
		ease: Linear.easeNone,
		onUpdate: this.onArtworkTransitionUpdate,
		onUpdateParams: [prop],
		onUpdateScope: this
	});

	return tweener;
};


hlc.views.AlbumView.prototype.onPlay = function(e){

	goog.array.forEach(this._tweeners, function(tweener) {
		tweener.play();
	});
};


hlc.views.AlbumView.prototype.onPause = function(e){

	goog.array.forEach(this._tweeners, function(tweener) {
		tweener.pause();
	});
};


hlc.views.AlbumView.prototype.onCrossfade = function(e){

	// first check if a texture of the id already exists for re-use
	// otherwise create and cache the texture with the id
	var id = e.img.getAttribute('data-id');
	var transition = e.img.getAttribute('data-transition');
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
	
	this._tweener = this.applyTransition( artworkSprite, transition );
	this._tweeners.push( this._tweener );

	//console.log('crossfade:', e.img, this._controller.albumIndex);
	//console.log(PIXI.TextureCache);
};


hlc.views.AlbumView.prototype.onArtworkTransitionUpdate = function(prop){

	var sprite = prop.sprite;

	// cover fit with transitional scale
	var textureWidth = sprite.texture.width;
	var textureHeight = sprite.texture.height;

	var viewWidth = this._renderTexture.width;
	var viewHeight = this._renderTexture.height;
	var viewRatio = viewWidth / viewHeight;

	var textureRatio = textureWidth / textureHeight;

	var scaledWidth, scaledHeight;

	if (viewRatio > textureRatio) {

		scaledWidth = viewWidth * prop.scale;
		scaledHeight = scaledWidth / textureRatio;

	} else {

		scaledHeight = viewHeight * prop.scale;
		scaledWidth = scaledHeight * textureRatio;
	}

	sprite.width = scaledWidth;
	sprite.height = scaledHeight;

	// align it with anchor
	sprite.x = (viewWidth - scaledWidth) * prop.x + scaledWidth * sprite.anchor.x;
	sprite.y = (viewHeight - scaledHeight) * prop.y + scaledHeight * sprite.anchor.y;

	// set alpha
	var alphaMultiplier = 3.5;

	sprite.alpha = Math.min(1, prop.alpha * alphaMultiplier);

	if(this._tweeners.length > 1 && this._tweener.target.alpha > (1/alphaMultiplier)) {

		this.recycle();
		//console.log(this._tweeners.length);

		if(this._coverSprite.parent) {
			this._coverSprite.parent.removeChild( this._coverSprite );
		}
	}
};


hlc.views.AlbumView.TRANSITION_PATTERN = 'from-{fromX}-{fromY}-to-{toX}-{toY}-scale-{scale}';


hlc.views.AlbumView.TRANSITION_PARAM = {
	TOP: 'top',
	BOTTOM: 'bottom',
	LEFT: 'left',
	RIGHT: 'right',
	CENTER: 'center',
	IN: 'in',
	OUT: 'out',
	NONE: 'none'
};


hlc.views.AlbumView.MAX_TEXTURE = 0;


hlc.views.AlbumView.ArtworkSpriteCache = {
	// id{String}: sprites{Array}
};