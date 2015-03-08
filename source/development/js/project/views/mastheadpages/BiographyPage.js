goog.provide('hlc.views.mastheadpages.BiographyPage');

goog.require('hlc.fx.Heading');
goog.require('hlc.views.mastheadpages.MastheadPage');
goog.require('hlc.views.mastheadpages.BiographyNavigation');
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

  this._heading = new hlc.fx.Heading( goog.dom.query('h2', this.domElement)[0] );
  this._heading.setProgress(0);

  this._size = null;
  this._nav = null;

  this._innerEl = null;
  this._fadeEls = null;
  this._fadeElYs = null;
  this._spacers = null;
  this._scrollerViewport = null;

  this._scrollbarEl = null;
  this._dummyEl = null;

  this._scroller = null;

  this._songButtons = {};
  this._songId = null;

  this._songs = {};

  this.hide();
};
goog.inherits(hlc.views.mastheadpages.BiographyPage, hlc.views.mastheadpages.MastheadPage);


hlc.views.mastheadpages.BiographyPage.prototype.createPageElements = function(){

	goog.base(this, 'createPageElements');

  this._songButtons = goog.dom.query('.song-button', this.domElement);

  this._spacers = goog.dom.query('.spacer', this.domElement);

  this._innerEl = goog.dom.getElementByClass('inner', this.domElement);
  this._fadeEls = goog.dom.query('.fade', this.domElement);

  this._scrollerViewport = goog.dom.getElementByClass('scroller-viewport', this.domElement);

  this._scrollbarEl = goog.dom.getElementByClass('scrollbar', this.domElement);
  this._dummyEl = goog.dom.getElementByClass('dummy-scroller', this.domElement);

  this._scroller = goog.userAgent.MOBILE ?
  	new hlc.views.common.Scroller(this.domElement, this._scrollbarEl) :
  	new hlc.views.common.DummyScroller(this._scrollerViewport, this._dummyEl, this._scrollbarEl);

  //TODO: addcallback not working for common.Scroller
  this._scroller.addCallback( hlc.events.EventType.SCROLL_UPDATE, goog.bind(this.onScrollUpdate, this) );

  // create navigation
  var navEl = goog.dom.query('nav', this.domElement)[0];
  this._nav = new hlc.views.mastheadpages.BiographyNavigation( navEl );
};


hlc.views.mastheadpages.BiographyPage.prototype.animateIn = function(){

  goog.base(this, 'animateIn');

  this._heading.animateIn( this._loadSuccess );

  if(this._scrollerViewport) {
    goog.dom.classlist.enable(this._scrollerViewport, 'animate-in', true);
  }
};


hlc.views.mastheadpages.BiographyPage.prototype.hide = function(){

  goog.base(this, 'hide');

  this._heading.reset();
  goog.dom.classlist.enable(this.domElement, 'scrolled', false);

  if(this._scrollerViewport) {
    goog.dom.classlist.enable(this._scrollerViewport, 'animate-in', false);
  }
};


hlc.views.mastheadpages.BiographyPage.prototype.activate = function(){

	goog.base(this, 'activate');

	this._scroller.activate();

  this._nav.activate();

  this._eventHandler.listen( this._nav, goog.events.EventType.CLICK, this.onClickNavButton, false, this );

  goog.array.forEach(this._songButtons, function(songButton) {
    this._eventHandler.listen( songButton, goog.events.EventType.CLICK, this.onClickSongButton, false, this );
  }, this);

  this._eventHandler.listen( this, hlc.models.SongModel.EventType.HTML_AUDIO_EVENTS, this.handleAudioEvents, false, this );

  // reset
  this.resize();
  this._scroller.reset();
};


hlc.views.mastheadpages.BiographyPage.prototype.deactivate = function(){

	goog.base(this, 'deactivate');

	this._scroller.deactivate();

  this._nav.deactivate();
};


hlc.views.mastheadpages.BiographyPage.prototype.resize = function(){

  goog.base(this, 'resize');

  var offset = 160;

  this._size = goog.style.getSize( this.domElement );

  // resize scroller viewport
  goog.style.setHeight(this._scrollerViewport, this._size.height - offset);

  // resize spacers
  goog.style.setHeight(this._spacers[0], 150);

  var lastSection = goog.array.peek( goog.dom.query('section', this.domElement) );
  var lastSectionHeight = goog.style.getSize(lastSection).height;
  goog.style.setHeight( this._spacers[1], (this._size.height - offset - lastSectionHeight)/2 );

  // refresh all relative Y of <li>
  this._fadeElYs = goog.array.map(this._fadeEls, function(li) {
    return goog.style.getRelativePosition(li, this._innerEl).y;
  }, this);
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
    case 'loadedmetadata':
    goog.array.forEach(songButtons, function(songButton) {
      var bar = goog.dom.getElementByClass('bar', songButton);
      goog.style.setStyle(bar, 'width', 0);
    });
    break;

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


hlc.views.mastheadpages.BiographyPage.prototype.onScrollUpdate = function(progress, scrollY){

  this._scrollProgress = progress;

  // update opacity for each <li>, based on scroll position
  var i, l = this._fadeEls.length;
  var offset = goog.style.getPageOffsetTop(this._scrollerViewport);
  for(i = 0; i < l; i++) {
    var y = this._fadeElYs[i];
    var opacity = Math.min(1, (1 - (y + scrollY + offset) / (this._size.height * .8))*2);
    goog.style.setStyle(this._fadeEls[i], 'opacity', opacity);
  }

  if(progress > 0) {
    goog.dom.classlist.enable(this.domElement, 'scrolled', true);
  }
};


hlc.views.mastheadpages.BiographyPage.prototype.onClickNavButton = function(e){

  var dataId;

  switch(e.id) {
    case 'education':
    dataId = 'education';
    break;

    case 'work-experience-awards':
    dataId = 'work-experience';
    break;

    case 'commissions':
    dataId = 'commissions';
    break;

    case 'premiers':
    dataId = 'premiers';
    break;

    case 'contact':
    dataId = 'contact';
    break;

    case 'home':
    hlc.main.controllers.navigationController.setToken('home');
    return;
    break;
  }

  var sectionEl = goog.dom.query('section[data-id="' + dataId + '"]', this.domElement)[0];
  var offsetHeight = goog.style.getSize(this._dummyEl).height * (1/3);
  var scrollY = Math.max(0, goog.style.getRelativePosition(sectionEl, this._innerEl).y - offsetHeight);

  this._dummyEl.scrollTop = scrollY;
};


hlc.views.mastheadpages.BiographyPage.prototype.onLoadProgressTick = function(e){

  goog.base(this, 'onLoadProgressTick', e);

  this._heading.setProgress( this._loadAnimationProgress );
};