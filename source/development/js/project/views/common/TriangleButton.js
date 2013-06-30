goog.provide('hlc.views.common.TriangleButton');

goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.math.Size');
goog.require('goog.math.Box');
goog.require('goog.fx.CssSpriteAnimation');

/**
 * @constructor
 */
hlc.views.common.TriangleButton = function(domElement){
  goog.base(this);

  this.domElement = domElement;
  this.backgroundDom = goog.dom.getElementByClass('background', this.domElement);

  var size = new goog.math.Size(114, 114);
  var box = new goog.math.Box(0, 114, 3192, 0);
  this.animation = new goog.fx.CssSpriteAnimation(this.backgroundDom, size, box, 800);
  this.animation.stop();
  goog.events.listen(this.animation, goog.fx.Transition.EventType.FINISH, this.onAnimationFinish, false, this);

  var randTime = Math.round( Math.random()*10000 + 5000 );
  this.timer = new goog.Timer(randTime);
  goog.events.listen(this.timer, goog.Timer.TICK, this.onTick, false, this);
};
goog.inherits(hlc.views.common.TriangleButton, goog.events.EventTarget);


hlc.views.common.TriangleButton.prototype.startAnimation = function(){
	this.timer.start();
};


hlc.views.common.TriangleButton.prototype.stopAnimation = function(){
	this.timer.stop();
};


hlc.views.common.TriangleButton.prototype.show = function(){
  goog.dom.classes.remove(this.domElement, 'hide');
};


hlc.views.common.TriangleButton.prototype.hide = function(){
  goog.dom.classes.add(this.domElement, 'hide');
};


hlc.views.common.TriangleButton.prototype.onTick = function(e){
	this.animation.play();
};


hlc.views.common.TriangleButton.prototype.onAnimationFinish = function(e){
	this.animation.stop();
};