goog.provide('hlc.views.mastheadpages.BiographyPage');

goog.require('hlc.views.mastheadpages.MastheadPage');
goog.require('hlc.models.AnimationModel');
goog.require('hlc.views.common.Scroller');
goog.require('hlc.views.common.DummyScroller');
goog.require('hlc.models.SongModel');


/**
 * @constructor
 */
hlc.views.mastheadpages.BiographyPage = function(){

	var domElement = goog.dom.getElement('biography');
	var url = hlc.Url.INCLUDES + 'biography';

  goog.base(this, domElement, url, 'biography');

  this._scrollProgress = 0;

  this._backgroundRenderer = null;
  this._backgroundStage = null;
  this._backgroundSprite = null;

  this._backgroundCanvas = null;

  this._scrollbarEl = null;
  this._dummyEl = null;

  this._scroller = null;

  this._songButtons = {};
  this._songId = null;

  this._songs = {};
};
goog.inherits(hlc.views.mastheadpages.BiographyPage, hlc.views.mastheadpages.MastheadPage);


hlc.views.mastheadpages.BiographyPage.prototype.createPageElements = function(){

	goog.base(this, 'createPageElements');

  this._backgroundCanvas = goog.dom.getElementByClass('background', this.domElement);

  this._songButtons = goog.dom.query('.song-button', this.domElement);

  this._scrollbarEl = goog.dom.getElementByClass('scrollbar', this.domElement);
  this._dummyEl = goog.dom.getElementByClass('dummy-scroller', this.domElement);

  this._scroller = goog.userAgent.MOBILE ?
  	new hlc.views.common.Scroller(this.domElement, this._scrollbarEl) :
  	new hlc.views.common.DummyScroller(this.domElement, this._dummyEl, this._scrollbarEl);

  //TODO: addcallback not working for common.Scroller
  this._scroller.addCallback( hlc.events.EventType.SCROLL_UPDATE, goog.bind(this.onScrollUpdate, this) );

  //
  this._backgroundRenderer = PIXI.autoDetectRenderer(0, 0, {
    view: this._backgroundCanvas
  });

  this._backgroundStage = new PIXI.Stage(0x000000);

  var backgroundTexture = new PIXI.Texture( new PIXI.BaseTexture( hlc.main.assets['biography-background'] ) );
  this._backgroundSprite = new PIXI.Sprite( backgroundTexture );
  this._backgroundStage.addChild( this._backgroundSprite );

  this.resize();

  this.onScrollUpdate( this._scrollProgress );
};


hlc.views.mastheadpages.BiographyPage.prototype.activate = function(){

	goog.base(this, 'activate');

	this._scroller.activate();

  goog.array.forEach(this._songButtons, function(songButton) {
    this._eventHandler.listen( songButton, goog.events.EventType.CLICK, this.onClickSongButton, false, this );
  }, this);

  this._eventHandler.listen( this, hlc.models.SongModel.EventType.HTML_AUDIO_EVENTS, this.handleAudioEvents, false, this );
};


hlc.views.mastheadpages.BiographyPage.prototype.deactivate = function(){

	goog.base(this, 'deactivate');

	this._scroller.deactivate();
};


hlc.views.mastheadpages.BiographyPage.prototype.resize = function(){

  goog.base(this, 'resize');

  var viewSize = goog.style.getSize( this.domElement );

  // resize renderer
  this._backgroundRenderer.resize( viewSize.width, viewSize.height );

  // resize background sprite

  // 'cover'
  /*
  var textureWidth = this._backgroundSprite.texture.width;
  var textureHeight = this._backgroundSprite.texture.height;

  var textureRatio = textureWidth / textureHeight;

  var scaledWidth, scaledHeight;

  if (viewSize.aspectRatio() > textureRatio) {

    scaledWidth = viewSize.width;
    scaledHeight = scaledWidth / videoRatio;

  } else {

    scaledHeight = viewSize.height;
    scaledWidth = scaledHeight * videoRatio;
  }

  this._backgroundSprite.width = scaledWidth;
  this._backgroundSprite.height = scaledHeight;

  var backgroundSpriteX = (viewSize.width - scaledWidth) / 2;
  var backgroundSpriteY = (viewSize.height - scaledHeight) / 2;
  */

  // make height always be 2x of the window
  var textureWidth = this._backgroundSprite.texture.width;
  var textureHeight = this._backgroundSprite.texture.height;

  var textureRatio = textureWidth / textureHeight;

  this._backgroundSprite.height = viewSize.height * 2;
  this._backgroundSprite.width = this._backgroundSprite.height * textureRatio;
  
  this._backgroundSprite.x = (viewSize.width - this._backgroundSprite.width) / 2;
};


hlc.views.mastheadpages.BiographyPage.prototype.onClickSongButton = function(e){

  var songId = e.currentTarget.getAttribute('data-id');

  if(this._songId === songId) {
    
    this._songs[ songId ].toggle();
    return;

  }else {

    this._songId = songId;
  }
  
  var songModel = hlc.models.SongModel.getSongById( this._songId );
  songModel.setParentEventTarget( this );

  songModel.activate();
  songModel.play();

  this._songs[songId] = songModel;
};


hlc.views.mastheadpages.BiographyPage.prototype.handleAudioEvents = function(e){

  var songButtons = goog.dom.query('.song-button[data-id="' + e.target.songId + '"]');

  switch(e.type) {
    case 'play':
    var keysToRemove = goog.object.getKeys(this._songs);
    goog.array.remove(keysToRemove, e.target.songId);

    goog.array.forEach(keysToRemove, function(key) {

      this._songs[key].dispose();

      goog.object.remove(this._songs, key);

      var songButtons = goog.dom.query('.song-button[data-id="' + key + '"]');
      goog.array.forEach(songButtons, function(songButton) {
        goog.dom.classes.enable( songButton, 'active', false );
      });
    }, this);

    goog.array.forEach(songButtons, function(songButton) {
      var bar = goog.dom.getElementByClass('bar', songButton);
      goog.style.setStyle(bar, 'width', 0);

      goog.dom.classes.enable( songButton, 'active', true );
      goog.dom.classes.enable( songButton, 'paused', false );
    });
    break;

    case 'pause':
    goog.array.forEach(songButtons, function(songButton) {
      goog.dom.classes.enable( songButton, 'paused', true );
    });
    break;

    case 'ended':
    goog.array.forEach(songButtons, function(songButton) {
      goog.dom.classes.enable( songButton, 'active', false );
    });
    break;

    case 'timeupdate':
    var progress = e.target.getProgress();

    goog.array.forEach(songButtons, function(songButton) {
      var bar = goog.dom.getElementByClass('bar', songButton);
      goog.style.setStyle(bar, 'width', progress * 100 + '%');
    });
    break;
  }
};


hlc.views.mastheadpages.BiographyPage.prototype.onScrollUpdate = function(progress){

  this._scrollProgress = progress;

  this._backgroundSprite.y = (this._backgroundRenderer.height - this._backgroundSprite.height) * progress;

  this._backgroundSprite.alpha = goog.math.lerp(1, .7, progress);

  this._backgroundRenderer.render( this._backgroundStage );
};