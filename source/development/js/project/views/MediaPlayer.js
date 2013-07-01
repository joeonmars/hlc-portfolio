goog.provide('hlc.views.MediaPlayer');

goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.dom.classes');
goog.require('hlc.views.mediaplayercontrols.SoundControl');

/**
 * @constructor
 */
hlc.views.MediaPlayer = function(){
  goog.base(this);

  this.domElement = goog.dom.getElement('media-player');
  this.parentDomElement = goog.dom.getParentElement(this.domElement);

  this._fullColumn = goog.dom.getElementByClass('fullColumn', this.domElement);
  this._playbackControlDom = goog.dom.getElementByClass('playbackControl', this.domElement);
  this._soundControlDom = goog.dom.getElementByClass('soundControl', this.domElement);
  this._progressControlDom = goog.dom.getElementByClass('progressControl', this.domElement);
  this._shareControlDom = goog.dom.getElementByClass('shareControl', this.domElement);

  this._playhead = goog.dom.getElementByClass('playhead', this.domElement);
  this._playButton = goog.dom.getElementByClass('playButton', this.domElement);

  this._size = goog.style.getSize(this.domElement);

  this.soundControl = new hlc.views.mediaplayercontrols.SoundControl(this, this._soundControlDom);

  // register media player to sound controller
  hlc.main.controllers.soundController.addDispatcher(this);
};
goog.inherits(hlc.views.MediaPlayer, goog.events.EventTarget);


hlc.views.MediaPlayer.prototype.init = function(){
	goog.events.listen(this, 'resize', this.onResize, false, this);
	hlc.main.controllers.windowController.addDispatcher(this);

	goog.events.listen(hlc.main.controllers.mainScrollController,
		hlc.controllers.MainScrollController.EventType.SCROLL_FINISH, this.onScrollFinish, false, this);

	goog.events.listen(this._playButton, 'click', this.onClick, false, this);

	goog.events.listen(this, ['play', 'pause', 'timeupdate'], this.onAudioEvent, false, this);
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
		case this._playButton:
		if(hlc.main.controllers.soundController.isPaused()) {
			hlc.main.controllers.soundController.play();
		}else {
			hlc.main.controllers.soundController.pause();
		}
		break;

		default:
		break;
	}
};


hlc.views.MediaPlayer.prototype.onAudioEvent = function(e){
	switch(e.type) {
		case 'play':
		goog.dom.classes.remove(this._playButton, 'pause');
		break;

		case 'pause':
		goog.dom.classes.add(this._playButton, 'pause');
		break;

		case 'timeupdate':
		var progress = e.audio.currentTime / e.audio.duration;
		goog.style.setStyle(this._playhead, 'width', progress * 100 + '%');
		break;

		default:
		break;
	}
};


hlc.views.MediaPlayer.prototype.onResize = function(e){
	var scrollbarWidth = e ? e.scrollbarWidth : hlc.main.controllers.windowController.getScrollbarWidth();
	goog.style.setStyle(this.domElement, 'padding-right', scrollbarWidth + 'px');

	var fullColumnWidth = goog.style.getSize(this._fullColumn).width;
	var playbackControlsWidth = goog.style.getSize(this._playbackControlDom).width;
	var soundControlsWidth = goog.style.getSize(this._soundControlDom).width;
	var shareControlDomWidth = goog.style.getSize(this._shareControlDom).width;

	var progressControlDomWidth = fullColumnWidth - playbackControlsWidth - soundControlsWidth - shareControlDomWidth;
	goog.style.setStyle(this._progressControlDom, 'width', progressControlDomWidth + 'px');
};