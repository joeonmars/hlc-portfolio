goog.provide('hlc.views.MainHud');

goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.dom.classes');
goog.require('hlc.views.MediaPlayer');
goog.require('hlc.views.Playlist');
goog.require('hlc.views.common.TriangleButton');

/**
 * @constructor
 */
hlc.views.MainHud = function(){
  goog.base(this);

  this.domElement = goog.dom.getElement('main-hud');
  this.sidebarButtonDom = goog.dom.query('.sidebarButton', this.domElement)[0];

  this.playlistButtonContainerDom = goog.dom.query('.playlistButtonContainer', this.domElement)[0];
  this.playlistButtonDom = goog.dom.query('.playlistButton', this.playlistButtonContainerDom)[0];
  this.playlistCloseButtonDom = goog.dom.query('.playlistCloseButton', this.playlistButtonContainerDom)[0];

  if(Modernizr.csstransforms3d) {
  	goog.dom.classes.add(this.playlistButtonContainerDom, 'use3d');
  }

  this.homeButtonDom = goog.dom.query('.homeButton', this.domElement)[0];
  this.bottomContainer = goog.dom.query('.bottom', this.domElement)[0];

  this.playlistButton = new hlc.views.common.TriangleButton(this.playlistButtonDom);
  this.playlistCloseButton = new hlc.views.common.TriangleButton(this.playlistCloseButtonDom);
  this.homeButton = new hlc.views.common.TriangleButton(this.homeButtonDom);
  this.sidebarButton = new hlc.views.common.TriangleButton(this.sidebarButtonDom);

  this.playlist = new hlc.views.Playlist();
  this.mediaPlayer = new hlc.views.MediaPlayer();
};
goog.inherits(hlc.views.MainHud, goog.events.EventTarget);


hlc.views.MainHud.prototype.init = function(){
	this.mediaPlayer.init();
	this.playlist.init();

	this.playlistButton.startAnimation();

	this.sidebarButton.hide();

	goog.events.listen(this, 'resize', this.onResize, false, this);
	hlc.main.controllers.windowController.addDispatcher(this);

	goog.events.listen(hlc.main.controllers.mainScrollController,
		hlc.controllers.MainScrollController.EventType.SCROLL_START, this.onScrollStart, false, this);

	goog.events.listen(hlc.main.controllers.mainScrollController,
		hlc.controllers.MainScrollController.EventType.SCROLL_FINISH, this.onScrollFinish, false, this);

	goog.events.listen(this.sidebarButtonDom, 'click', this.onClick, false, this);
	goog.events.listen(this.playlistButtonDom, 'click', this.onClick, false, this);
	goog.events.listen(this.playlistCloseButtonDom, 'click', this.onClick, false, this);
	goog.events.listen(this.homeButtonDom, 'click', this.onClick, false, this);

	goog.events.listen(this.playlist, hlc.views.Playlist.EventType.SHOW_START, this.onPlaylistShowStart, false, this);
	goog.events.listen(this.playlist, hlc.views.Playlist.EventType.HIDE_START, this.onPlaylistHideStart, false, this);
	goog.events.listen(this.playlist, hlc.views.Playlist.EventType.HIDE_FINISH, this.onPlaylistHideFinish, false, this);

	goog.events.listen(hlc.main.views.sidebar, hlc.views.Sidebar.EventType.SLIDE_IN, this.onSidebarSlideIn, false, this);
	goog.events.listen(hlc.main.views.sidebar, hlc.views.Sidebar.EventType.SLIDED_OUT, this.onSidebarSlidedOut, false, this);

	goog.events.listen(hlc.main.views.mastheadSection, hlc.views.MastheadSection.EventType.PAGE_LOADED, this.onMastheadPageLoaded, false, this);
};


hlc.views.MainHud.prototype.showBottom = function(){
	goog.dom.classes.remove(this.bottomContainer, 'hide');
};


hlc.views.MainHud.prototype.hideBottom = function(){
	goog.dom.classes.add(this.bottomContainer, 'hide');
};


hlc.views.MainHud.prototype.onScrollStart = function(e){
	if(e.scrollPosition === hlc.controllers.MainScrollController.ScrollPosition.MASTHEAD) {
		this.hideBottom();
		this.sidebarButton.hide();
	}
};


hlc.views.MainHud.prototype.onScrollFinish = function(e){
	if(e.scrollPosition === hlc.controllers.MainScrollController.ScrollPosition.MASTHEAD) {
		this.homeButton.stopAnimation();
		this.hideBottom();
		this.sidebarButton.stopAnimation();
		this.sidebarButton.hide();
	}else {
		this.homeButton.startAnimation();
		this.showBottom();
		this.sidebarButton.startAnimation();
		this.sidebarButton.show();
	}
};


hlc.views.MainHud.prototype.onPlaylistShowStart = function(e){
	this.mediaPlayer.hide();

	goog.dom.classes.add(this.playlistButtonContainerDom, 'flip');

	this.playlistButton.stopAnimation();
	this.playlistCloseButton.startAnimation();
};


hlc.views.MainHud.prototype.onPlaylistHideStart = function(e){
	goog.dom.classes.remove(this.playlistButtonContainerDom, 'flip');

	this.playlistButton.startAnimation();
	this.playlistCloseButton.stopAnimation();
};


hlc.views.MainHud.prototype.onPlaylistHideFinish = function(e){
	this.mediaPlayer.show();
};


hlc.views.MainHud.prototype.onMastheadPageLoaded = function(e){
	this.homeButton.setText(e.target.title);
};


hlc.views.MainHud.prototype.onSidebarSlideIn = function(e){
	this.sidebarButton.hide();
};


hlc.views.MainHud.prototype.onSidebarSlidedOut = function(e){
	this.sidebarButton.show();
};


hlc.views.MainHud.prototype.onClick = function(e){
	switch(e.currentTarget) {
		case this.sidebarButtonDom:
		hlc.main.views.sidebar.toggle();
		break;

		case this.playlistButtonDom:
		case this.playlistCloseButtonDom:
		if(!this.playlist.isTweening()) {
			this.playlist.toggle();
		}
		break;

		case this.homeButtonDom:
		hlc.main.controllers.mainScrollController.scrollTo(hlc.controllers.MainScrollController.ScrollPosition.MASTHEAD);
		break;
	}
};


hlc.views.MainHud.prototype.onResize = function(e){
	var sidebarButtonDomSize = goog.style.getSize(this.sidebarButtonDom);
	var sidebarButtonDomY = (e.mainViewportSize.height - sidebarButtonDomSize.height ) / 2;
	goog.style.setStyle(this.sidebarButtonDom, {'top': sidebarButtonDomY + 'px', 'right': e.scrollbarWidth + sidebarButtonDomSize.width + 'px'});

	goog.style.setStyle(this.bottomContainer, 'top', e.mainViewportSize.height + 'px');
};