goog.provide('hlc.views.mediaplayercontrols.SoundControl');

goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.dom.classes');
goog.require('goog.fx.Dragger');

/**
 * @constructor
 */
hlc.views.mediaplayercontrols.SoundControl = function(domElement){
  goog.base(this);

  this.domElement = domElement;

  this.volume = 1;

  this._bar = goog.dom.query('.bar', this.domElement)[0];
  this._handle = goog.dom.query('.handle', this.domElement)[0];

  var dragRect = new goog.math.Rect(-1, -1, 109, 0);
  this._dragger = new goog.fx.Dragger(this._handle, null, dragRect);

  goog.events.listen(this._dragger, goog.fx.Dragger.EventType.DRAG, this.onDrag, false, this);

  this.simDrag(1);
};
goog.inherits(hlc.views.mediaplayercontrols.SoundControl, goog.events.EventTarget);


hlc.views.mediaplayercontrols.SoundControl.prototype.simDrag = function(percent) {
	this._dragger.deltaX = this._dragger.limits.width * percent;

	goog.style.setPosition(this._handle, this._dragger.deltaX, this._dragger.limits.top);

	var ev = {
		type: goog.fx.Dragger.EventType.DRAG,
		dragger: this._dragger
	};

	this._dragger.dispatchEvent(ev);
};


hlc.views.mediaplayercontrols.SoundControl.prototype.onDrag = function(e){
  var percent = e.dragger.deltaX / e.dragger.limits.width;
  percent = Math.max(Math.min(percent, 1), 0);

  goog.style.setStyle(this._bar, 'width', percent * 100 + '%');

  this.volume = percent;

  hlc.main.controllers.soundController.setVolume(this.volume);
};