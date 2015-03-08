goog.provide('hlc.views.MainHud');

goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.dom.classlist');
goog.require('hlc.views.MediaPlayer');
goog.require('hlc.views.Playlist');
goog.require('hlc.views.common.TriangleButton');
goog.require('hlc.views.DiamondButtonTracker');

/**
 * @constructor
 */
hlc.views.MainHud = function(){
  goog.base(this);

  this.domElement = goog.dom.getElement('main-hud');
  this.sidebarButtonEl = goog.dom.getElementByClass('sidebarButton', this.domElement);

  this.playlistButtonContainerEl = goog.dom.getElementByClass('playlistButtonContainer', this.domElement);
  this.playlistButtonEl = goog.dom.getElementByClass('playlistButton', this.domElement);
  this.playlistCloseButtonEl = goog.dom.getElementByClass('playlistCloseButton', this.domElement);

  this.bottomContainerEl = goog.dom.getElementByClass('bottom', this.domElement);

  this.playlistButton = new hlc.views.common.TriangleButton(this.playlistButtonEl);
  this.playlistCloseButton = new hlc.views.common.TriangleButton(this.playlistCloseButtonEl);
  this.sidebarButton = new hlc.views.common.TriangleButton(this.sidebarButtonEl);

  this.playlist = new hlc.views.Playlist();
  this.mediaPlayer = new hlc.views.MediaPlayer();

  // track playlist diamond buttons
  var tracker = hlc.views.DiamondButtonTracker.getInstance();
  tracker.add(this.playlistButtonEl, 'down', new goog.math.Size(114, 57));
  tracker.add(this.playlistCloseButtonEl, 'down', new goog.math.Size(114, 57));
  tracker.add(this.sidebarButtonEl, 'left', new goog.math.Size(57, 114));
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
		hlc.events.EventType.SCROLL_START, this.onScrollStart, false, this);

	goog.events.listen(hlc.main.controllers.mainScrollController,
		hlc.events.EventType.SCROLL_COMPLETE, this.onScrollFinish, false, this);

	goog.events.listen(this.sidebarButtonEl, 'click', this.onClick, false, this);
	goog.events.listen(this.playlistButtonEl, 'click', this.onClick, false, this);
	goog.events.listen(this.playlistCloseButtonEl, 'click', this.onClick, false, this);

	goog.events.listen(this.playlist, hlc.views.Playlist.EventType.SHOW_START, this.onPlaylistShowStart, false, this);
	goog.events.listen(this.playlist, hlc.views.Playlist.EventType.HIDE_START, this.onPlaylistHideStart, false, this);
	goog.events.listen(this.playlist, hlc.views.Playlist.EventType.HIDE_FINISH, this.onPlaylistHideFinish, false, this);

	goog.events.listen(hlc.main.views.sidebar, hlc.views.Sidebar.EventType.SLIDE_IN, this.onSidebarSlideIn, false, this);
	goog.events.listen(hlc.main.views.sidebar, hlc.views.Sidebar.EventType.SLIDED_OUT, this.onSidebarSlidedOut, false, this);

	goog.events.listen(hlc.main.views.mastheadSection, hlc.views.MastheadSection.EventType.PAGE_LOADED, this.onMastheadPageLoaded, false, this);
};


hlc.views.MainHud.prototype.showPlayerUI = function(){
	goog.dom.classlist.enable(this.bottomContainerEl, 'hide', false);
	goog.dom.classlist.enable(this.playlistButtonEl, 'hide', false);
};


hlc.views.MainHud.prototype.hidePlayerUI = function(){
	goog.dom.classlist.enable(this.bottomContainerEl, 'hide', true);
	goog.dom.classlist.enable(this.playlistButtonEl, 'hide', true);
};


hlc.views.MainHud.prototype.onScrollStart = function(e){
	if(e.scrollPosition === hlc.controllers.MainScrollController.ScrollPosition.MASTHEAD) {
		this.hidePlayerUI();
		this.sidebarButton.hide();
	}
};


hlc.views.MainHud.prototype.onScrollFinish = function(e){
	if(e.scrollPosition === hlc.controllers.MainScrollController.ScrollPosition.MASTHEAD) {
		this.hidePlayerUI();
		this.sidebarButton.stopAnimation();
		this.sidebarButton.hide();
	}else {
		this.showPlayerUI();

		if(!hlc.main.views.sidebar.isSlidedIn) {
			this.sidebarButton.startAnimation();
			this.sidebarButton.show();
		}
	}
};


hlc.views.MainHud.prototype.onPlaylistShowStart = function(e){
	this.mediaPlayer.hide();

	goog.dom.classlist.enable(this.playlistButtonContainerEl, 'flip', true);

	this.playlistButton.stopAnimation();
	this.playlistCloseButton.startAnimation();
};


hlc.views.MainHud.prototype.onPlaylistHideStart = function(e){
	goog.dom.classlist.enable(this.playlistButtonContainerEl, false, 'flip');

	this.playlistButton.startAnimation();
	this.playlistCloseButton.stopAnimation();
};


hlc.views.MainHud.prototype.onPlaylistHideFinish = function(e){
	this.mediaPlayer.show();
};


hlc.views.MainHud.prototype.onMastheadPageLoaded = function(e){

};


hlc.views.MainHud.prototype.onSidebarSlideIn = function(e){
	this.sidebarButton.hide();
};


hlc.views.MainHud.prototype.onSidebarSlidedOut = function(e){
	if(hlc.main.controllers.mainScrollController.scrollPosition != hlc.controllers.MainScrollController.ScrollPosition.MASTHEAD) {
		this.sidebarButton.show();
	}
};


hlc.views.MainHud.prototype.onClick = function(e){
	e.preventDefault();

	var tracker = hlc.views.DiamondButtonTracker.getInstance();

	switch(e.currentTarget) {
		case this.sidebarButton:
		var hasClickedOnShape = tracker.getClickResult(e, true);
		if(!hasClickedOnShape) return false;

		hlc.main.views.sidebar.toggle();
		break;

		case this.playlistButton:
		var hasClickedOnShape = tracker.getClickResult(e);
		if(!hasClickedOnShape) return false;

		if(!this.playlist.isTweening()) {
			this.playlist.toggle();
		}
		break;

		case this.playlistCloseButton:
		var hasClickedOnShape = tracker.getClickResult(e, true);
		if(!hasClickedOnShape) return false;

		if(!this.playlist.isTweening()) {
			this.playlist.toggle();
		}
		break;
	}
};


hlc.views.MainHud.prototype.onResize = function(e){
	
	var sidebarButtonDomSize = goog.style.getSize(this.sidebarButtonEl);
	var sidebarButtonDomY = (e.mainViewportSize.height - sidebarButtonDomSize.height ) / 2;
	goog.style.setStyle(this.sidebarButtonEl, {'top': sidebarButtonDomY + 'px', 'right': sidebarButtonDomSize.width + 'px'});

	goog.style.setStyle(this.bottomContainerEl, 'top', e.mainViewportSize.height + 'px');
};