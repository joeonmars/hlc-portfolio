goog.provide('hlc.views.MainHud');

goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.dom.classes');
goog.require('hlc.views.MediaPlayer');
goog.require('hlc.views.Playlist');

/**
 * @constructor
 */
hlc.views.MainHud = function(){
  goog.base(this);

  this.domElement = goog.dom.getElement('main-hud');
  this.sidebarButton = goog.dom.query('.sidebarButton', this.domElement)[0];
  this.playlistButton = goog.dom.query('.playlistButton', this.domElement)[0];
  this.homeButton = goog.dom.query('.homeButton', this.domElement)[0];
  this.playlistButton = goog.dom.query('.playlistButton', this.domElement)[0];
  this.bottomContainer = goog.dom.query('.bottom', this.domElement)[0];

  this.playlist = new hlc.views.Playlist();
  this.mediaPlayer = new hlc.views.MediaPlayer();
};
goog.inherits(hlc.views.MainHud, goog.events.EventTarget);


hlc.views.MainHud.prototype.init = function(){
	this.mediaPlayer.init();
	this.playlist.init();

	goog.events.listen(this, 'resize', this.onResize, false, this);
	hlc.main.controllers.windowController.addDispatcher(this);

	goog.events.listen(hlc.main.controllers.mainScrollController,
		hlc.controllers.MainScrollController.EventType.SCROLL_START, this.onScrollStart, false, this);

	goog.events.listen(hlc.main.controllers.mainScrollController,
		hlc.controllers.MainScrollController.EventType.SCROLL_FINISH, this.onScrollFinish, false, this);

	goog.events.listen(this.sidebarButton, 'click', this.onClick, false, this);
	goog.events.listen(this.playlistButton, 'click', this.onClick, false, this);
	goog.events.listen(this.homeButton, 'click', this.onClick, false, this);

	goog.events.listen(this.playlist, hlc.views.Playlist.EventType.SHOW, this.onPlaylistShow, false, this);
	goog.events.listen(this.playlist, hlc.views.Playlist.EventType.HIDE, this.onPlaylistHide, false, this);
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
	}
};


hlc.views.MainHud.prototype.onScrollFinish = function(e){
	if(e.scrollPosition === hlc.controllers.MainScrollController.ScrollPosition.MASTHEAD) {
		this.hideBottom();
		goog.dom.classes.add(this.sidebarButton, 'hide');
	}else {
		this.showBottom();
		goog.dom.classes.remove(this.sidebarButton, 'hide');
	}
};


hlc.views.MainHud.prototype.onPlaylistShow = function(e){
	this.mediaPlayer.hide();
	hlc.main.views.footer.up(false);
};


hlc.views.MainHud.prototype.onPlaylistHide = function(e){
	this.mediaPlayer.show();
	hlc.main.views.footer.up(true);
};


hlc.views.MainHud.prototype.onClick = function(e){
	switch(e.currentTarget) {
		case this.sidebarButton:
		hlc.main.views.sidebar.toggle();
		break;

		case this.playlistButton:
		this.playlist.toggle();
		break;

		case this.homeButton:
		hlc.main.controllers.mainScrollController.scrollTo(hlc.controllers.MainScrollController.ScrollPosition.MASTHEAD);
		break;
	}
};


hlc.views.MainHud.prototype.onResize = function(e){
	var sidebarButtonSize = goog.style.getSize(this.sidebarButton);
	var sidebarButtonY = (e.mainViewportSize.height - sidebarButtonSize.height ) / 2;
	goog.style.setStyle(this.sidebarButton, {'top': sidebarButtonY + 'px', 'right': e.scrollbarWidth + sidebarButtonSize.width + 'px'});

	goog.style.setStyle(this.bottomContainer, 'top', e.mainViewportSize.height + 'px');
};