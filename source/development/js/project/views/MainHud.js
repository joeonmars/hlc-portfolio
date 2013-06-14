goog.provide('hlc.views.MainHud');

goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('hlc.views.MediaPlayer');

/**
 * @constructor
 */
hlc.views.MainHud = function(){
  goog.base(this);

  this.domElement = goog.dom.getElement('main-hud');
  this.sidebarButton = goog.dom.query('.sidebarButton', this.domElement)[0];

  this.mediaPlayer = new hlc.views.MediaPlayer();

  this._scrollBarWidth = goog.style.getScrollbarWidth();
};
goog.inherits(hlc.views.MainHud, goog.events.EventTarget);


hlc.views.MainHud.prototype.init = function(){
	this.mediaPlayer.init();

	goog.events.listen(this, 'resize', this.onResize, false, this);
	hlc.main.controllers.windowController.addDispatcher(this);

	goog.events.listen(this.sidebarButton, 'click', this.onClick, false, this);
};


hlc.views.MainHud.prototype.onClick = function(e){
	switch(e.currentTarget) {
		case this.sidebarButton:
		hlc.main.views.sidebar.toggle();
		break;
	}
};


hlc.views.MainHud.prototype.onResize = function(e){
	var sidebarButtonSize = goog.style.getSize(this.sidebarButton);
	var sidebarButtonY = (e.mainViewportSize.height - sidebarButtonSize.height ) / 2;
	goog.style.setStyle(this.sidebarButton, 'top', sidebarButtonY + 'px');
};