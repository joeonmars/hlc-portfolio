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

  this._scrollbarEl = goog.dom.getElementByClass('scrollbar', this.domElement);
  this._dummyEl = goog.dom.getElementByClass('dummy-scroller', this.domElement);

  this._scroller = goog.userAgent.MOBILE ?
  	new hlc.views.common.Scroller(this.domElement, this._scrollbarEl) :
  	new hlc.views.common.DummyScroller(this.domElement, this._dummyEl, this._scrollbarEl);

  this._songButtons = goog.dom.query('.song-button', this.domElement);
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


hlc.views.mastheadpages.BiographyPage.prototype.onResize = function(e){

};