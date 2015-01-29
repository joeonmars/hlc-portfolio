goog.provide('hlc.views.common.FrameButton');

goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.dom.classes');

/**
 * @constructor
 */
hlc.views.common.FrameButton = function(domElement){

  goog.base(this);

  this.domElement = domElement;

  this._shapeEl = goog.dom.getElementByClass('shape', this.domElement);

  this._frameProgress = 0;
  this._totalFrames = 30;
  this._currentFrame = 0;

  this._isUp = goog.dom.classes.has(this.domElement, 'up');
  this._isDown = goog.dom.classes.has(this.domElement, 'down');

  this._shapeTweener = TweenMax.to(this, .5, {
    _frameProgress: 1,
    'paused': true,
    'ease': Cubic.easeInOut,
    'onUpdate': this.onFrameUpdate,
    'onUpdateScope': this
  });

  this._rotateTweener = TweenMax.fromTo(this._shapeEl, .35, {
    'scale': 1,
    'y': 0
  },{
    'scale': 1.025,
    'y': this._isUp ? -2 : 2,
    'paused': true,
    'immediateRender': true,
    'ease': Expo.easeInOut
  });

  this._moveTweener = TweenMax.fromTo(this.domElement, .5, {
    'y': 0
  },{
    'y': this._isUp ? -2 : 2,
    'paused': true,
    'immediateRender': true,
    'ease': Cubic.easeInOut
  });
};
goog.inherits(hlc.views.common.FrameButton, goog.events.EventTarget);


hlc.views.common.FrameButton.prototype.activate = function(){

  goog.events.listen(this.domElement, goog.events.EventType.MOUSEOVER, this.onMouseOver, false, this);
  goog.events.listen(this.domElement, goog.events.EventType.MOUSEOUT, this.onMouseOut, false, this);
};


hlc.views.common.FrameButton.prototype.deactivate = function(){

  goog.events.unlisten(this.domElement, goog.events.EventType.MOUSEOVER, this.onMouseOver, false, this);
  goog.events.unlisten(this.domElement, goog.events.EventType.MOUSEOUT, this.onMouseOut, false, this);
};


hlc.views.common.FrameButton.prototype.gotoFrame = function(frame){

  var lastFrame = this._currentFrame;

  this._currentFrame = frame;

  goog.dom.classes.addRemove(this._shapeEl, 'frame-'+lastFrame, 'frame-'+this._currentFrame);
};


hlc.views.common.FrameButton.prototype.onMouseOver = function(e){

  if(goog.dom.contains(this.domElement, e.relatedTarget)) {
    return false;
  }

  this._shapeTweener.play();
  this._rotateTweener.play();
  this._moveTweener.play();
};


hlc.views.common.FrameButton.prototype.onMouseOut = function(e){

  if(goog.dom.contains(this.domElement, e.relatedTarget)) {
    return false;
  }

  this._shapeTweener.reverse();
  this._rotateTweener.reverse();
  this._moveTweener.reverse();
};


hlc.views.common.FrameButton.prototype.onFrameUpdate = function(){

  var frame = Math.round(this._frameProgress * (this._totalFrames - 1));

  this.gotoFrame( frame );
};