goog.provide('hlc.views.MediaPlayer');

goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.dom.classes');

/**
 * @constructor
 */
hlc.views.MediaPlayer = function(){
  goog.base(this);

  this.domElement = goog.dom.getElement('media-player');
  this.parentDomElement = goog.dom.getParentElement(this.domElement);

  this._playbackControls = goog.dom.getElementByClass('playbackControls', this.domElement);
  this._soundControls = goog.dom.getElementByClass('soundControls', this.domElement);
  this._progressControls = goog.dom.getElementByClass('progressControls', this.domElement);
  this._shareControls = goog.dom.getElementByClass('shareControls', this.domElement);

  this._size = goog.style.getSize(this.domElement);
};
goog.inherits(hlc.views.MediaPlayer, goog.events.EventTarget);


hlc.views.MediaPlayer.prototype.init = function(){
	goog.events.listen(this, 'resize', this.onResize, false, this);
	hlc.main.controllers.windowController.addDispatcher(this);

	goog.events.listen(hlc.main.controllers.mainScrollController,
		hlc.controllers.MainScrollController.EventType.SCROLL_FINISH, this.onScrollFinish, false, this);
};


hlc.views.MediaPlayer.prototype.show = function(){
	goog.dom.classes.remove(this.parentDomElement, 'hidePlayer');
};


hlc.views.MediaPlayer.prototype.hide = function(){
	goog.dom.classes.add(this.parentDomElement, 'hidePlayer');
};


hlc.views.MediaPlayer.prototype.onScrollFinish = function(e){
	if(e.scrollPosition === hlc.controllers.MainScrollController.ScrollPosition.MASTHEAD) {
		this.hide();
	}else {
		this.show();
	}
};


hlc.views.MediaPlayer.prototype.onClick = function(e){
	switch(e.currentTarget) {
		default:
		break;
	}
};


hlc.views.MediaPlayer.prototype.onResize = function(e){
	goog.style.setStyle(this.domElement, 'padding-right', e.scrollbarWidth + 'px');

	var _domElementWidth = goog.style.getSize(this.domElement).width;
	var _playbackControlsWidth = goog.style.getSize(this._playbackControls).width;
	var _soundControlsWidth = goog.style.getSize(this._soundControls).width;
	var _shareControlsWidth = goog.style.getSize(this._shareControls).width;

	var progressControlsWidth = _domElementWidth - _playbackControlsWidth - _soundControlsWidth - _shareControlsWidth;
	goog.style.setStyle(this._progressControls, 'width', progressControlsWidth + 'px');
};