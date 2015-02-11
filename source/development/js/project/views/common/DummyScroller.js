goog.provide('hlc.views.common.DummyScroller');

goog.require('goog.async.Delay');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventHandler');
goog.require('goog.dom');
goog.require('goog.fx.Dragger');
goog.require('goog.math.Size');
goog.require('goog.math.Box');
goog.require('hlc.events');

/**
 * @constructor
 */
hlc.views.common.DummyScroller = function(viewOuter, dummyOuter, scrollbar){

  goog.base(this);

  this._viewOuter = viewOuter;
  this._viewInner = goog.dom.getElementByClass('inner', viewOuter);

  this._dummyOuter = dummyOuter;
  this._dummyInner = goog.dom.getElementByClass('inner', dummyOuter);

  this._scrollbar = scrollbar;
  this._handle = goog.dom.getElementByClass('handle', this._scrollbar);

  this._dummyScrollTop = 0;
  this._viewInnerY = 0;
  this._viewInnerHeight = 0;
  this._viewOuterHeight = 0;
  this._dummyInnerHeight = 0;
  this._dummyOuterHeight = 0;
  this._handleHeight = 0;

  this._dragger = new goog.fx.Dragger(this._handle);
  this._dragger.defaultAction = goog.nullFunction;
  this._draggerLimits = new goog.math.Rect(0, 0, 0, 0);

  this._callbacks = {};
  this._callbacks[ hlc.events.EventType.SCROLL_UPDATE ] = [];
  this._callbacks[ hlc.events.EventType.SCROLL_COMPLETE ] = [];

  this._eventHandler = new goog.events.EventHandler(this);

  this._disableDummyScrollDelay = new goog.async.Delay(this.disableDummyScroll, 250, this);
};
goog.inherits(hlc.views.common.DummyScroller, goog.events.EventTarget);


hlc.views.common.DummyScroller.prototype.activate = function(){

  this._eventHandler.listen(this._viewOuter, 'mousewheel', this.onMouseWheel, false, this);

  this._eventHandler.listen(this._dummyOuter, 'scroll', this.onDummyScroll, false, this);

  this._eventHandler.listen(this._dragger, goog.fx.Dragger.EventType.START, this.onDragHandleStart, false, this);
  this._eventHandler.listen(this._dragger, goog.fx.Dragger.EventType.END, this.onDragHandleEnd, false, this);
  this._eventHandler.listen(this._dragger, goog.fx.Dragger.EventType.DRAG, this.onDragHandle, false, this);

  this._eventHandler.listen(this, 'resize', this.onResize, false, this);
  hlc.main.controllers.windowController.addDispatcher(this);
};


hlc.views.common.DummyScroller.prototype.deactivate = function(){

  this._eventHandler.removeAll();
  hlc.main.controllers.windowController.removeDispatcher(this);
};


hlc.views.common.DummyScroller.prototype.reset = function(){

  this.onResize();
  this.scrollTo(0);
};


hlc.views.common.DummyScroller.prototype.getProgress = function(){

  return Math.abs( this._viewInnerY / (this._viewInnerHeight - this._viewOuterHeight) );
};


hlc.views.common.DummyScroller.prototype.enableDummyScroll = function(){

  goog.dom.classes.enable( this._dummyOuter, 'enabled', true );
};


hlc.views.common.DummyScroller.prototype.disableDummyScroll = function(){

  goog.dom.classes.enable( this._dummyOuter, 'enabled', false );
};


hlc.views.common.DummyScroller.prototype.addCallback = function( type, callback ){

  goog.array.insert( this._callbacks[ type ], callback );
};


hlc.views.common.DummyScroller.prototype.removeCallback = function( type, callback ){

  goog.array.remove( this._callbacks[ type ], callback );
};


hlc.views.common.DummyScroller.prototype.scrollTo = function(y){

  this._viewInnerY = y;

  goog.style.setStyle( this._viewInner, 'transform', 'translateY(' + this._viewInnerY + 'px)' );

  var handleRatio = Math.abs(this._viewInnerY / this._viewInnerHeight);
  var handleY = this._viewOuterHeight * handleRatio;
  goog.style.setPosition( this._handle, 0, handleY );

  // call update callbacks
  var updateCallbacks = this._callbacks[hlc.events.EventType.SCROLL_UPDATE];
  var i, l = updateCallbacks.length;
  for(i = 0; i < l; i++) {
    updateCallbacks[i]( this._viewInnerY, this.getProgress() );
  }
};


hlc.views.common.DummyScroller.prototype.onDummyScroll = function(e){

  this._dummyScrollRatio = this._dummyOuter.scrollTop / (this._dummyOuter.scrollHeight - this._dummyOuterHeight);

  goog.fx.anim.registerAnimation( this );
};


hlc.views.common.DummyScroller.prototype.onMouseWheel = function(e){

  this.enableDummyScroll();

  this._disableDummyScrollDelay.start();
};


hlc.views.common.DummyScroller.prototype.onDragHandleStart = function(e){

  goog.dom.classes.add(this._scrollbar, 'down');
};


hlc.views.common.DummyScroller.prototype.onDragHandleEnd = function(e){

  goog.dom.classes.remove(this._scrollbar, 'down');
};


hlc.views.common.DummyScroller.prototype.onDragHandle = function(e){

  var ratio = goog.math.clamp(e.dragger.deltaY / this._draggerLimits.height, 0, 1);

  this._dummyOuter.scrollTop = (this._viewInnerHeight - this._viewOuterHeight) * ratio;
};


hlc.views.common.DummyScroller.prototype.onAnimationFrame = function (now) {

  var startY = 0;
  var endY = -(this._viewInnerHeight - this._viewOuterHeight);

  var targetY = goog.math.lerp( startY, endY, this._dummyScrollRatio );

  this._viewInnerY += (targetY - this._viewInnerY) * .1;

  this.scrollTo( this._viewInnerY );

  if(goog.math.nearlyEquals(this._viewInnerY, targetY, .1)) {
    goog.fx.anim.unregisterAnimation( this );

    // call complete callbacks
    var completeCallbacks = this._callbacks[hlc.events.EventType.SCROLL_COMPLETE];
    var i, l = completeCallbacks.length;
    for(i = 0; i < l; i++) {
      completeCallbacks[i]( this._viewInnerY );
    }
  }
};


hlc.views.common.DummyScroller.prototype.onResize = function (e) {

  this._viewInnerHeight = goog.style.getSize(this._viewInner).height;
  this._viewOuterHeight = goog.style.getSize(this._viewOuter).height;

  // resize dummy view
  var viewInnerHeightFraction = this._viewInnerHeight / this._viewOuterHeight;

  this._dummyOuterHeight = goog.style.getSize(this._viewOuter).height;
  this._dummyInnerHeight = this._dummyOuterHeight * viewInnerHeightFraction;
  goog.style.setHeight( this._dummyInner, this._dummyInnerHeight );

  // resize scrollbar
  this._handleHeight = this._dummyOuterHeight / viewInnerHeightFraction;
  goog.style.setHeight(this._handle, this._handleHeight);

  this._draggerLimits.height = this._dummyOuterHeight - this._handleHeight;
  this._dragger.setLimits( this._draggerLimits );
};