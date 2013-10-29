goog.provide('hlc.views.common.Scroller');

goog.require('goog.events.EventTarget');
goog.require('goog.events.EventHandler');
goog.require('goog.dom');
goog.require('goog.fx.Dragger');
goog.require('goog.math.Size');
goog.require('goog.math.Box');

/**
 * @constructor
 */
hlc.views.common.Scroller = function(outer, scrollbar){
  goog.base(this);

  this._outerDom = outer;
  this._scrollbarDom = scrollbar;
  this._handleDom = goog.dom.getElementByClass('handle', this._scrollbarDom);

  this._draggable = new Draggable(this._outerDom, {
    'type': "scrollTop",
    'edgeResistance': 0.75,
    'throwProps': true,
    'cursor': 'default',
    'onDrag': this.onScrollUpdate,
    'onDragScope': this,
    'onThrowUpdate': this.onScrollUpdate,
    'onThrowUpdateScope': this
  });

  this._dragger = new goog.fx.Dragger(this._handleDom);
  this._draggerLimits = new goog.math.Rect(0, 0, 0, 0);

  this._eventHandler = new goog.events.EventHandler(this);
};
goog.inherits(hlc.views.common.Scroller, goog.events.EventTarget);


hlc.views.common.Scroller.prototype.activate = function(){
  if(!goog.userAgent.MOBILE) {
    this._eventHandler.listen(this._outerDom, 'scroll', this.onNativeScroll, false, this);
    this._eventHandler.listen(this._dragger, goog.fx.Dragger.EventType.START, this.onDragHandleStart, false, this);
    this._eventHandler.listen(this._dragger, goog.fx.Dragger.EventType.END, this.onDragHandleEnd, false, this);
    this._eventHandler.listen(this._dragger, goog.fx.Dragger.EventType.DRAG, this.onDragHandle, false, this);
  }

  this._eventHandler.listen(this, 'resize', this.onResize, false, this);
  hlc.main.controllers.windowController.addDispatcher(this);
};


hlc.views.common.Scroller.prototype.deactivate = function(){
  this._eventHandler.removeAll();
  hlc.main.controllers.windowController.removeDispatcher(this);
};


hlc.views.common.Scroller.prototype.reset = function(){
  this.onResize();
  this.scrollTo(0);
};


hlc.views.common.Scroller.prototype.scrollTo = function(y){
  this._draggable.scrollProxy.scrollTop(y);
  this._draggable.update();

  this.onScrollUpdate();
};


hlc.views.common.Scroller.prototype.onDragHandleStart = function(e){
  goog.dom.classes.add(this._scrollbarDom, 'down');
};


hlc.views.common.Scroller.prototype.onDragHandleEnd = function(e){
  goog.dom.classes.remove(this._scrollbarDom, 'down');
};


hlc.views.common.Scroller.prototype.onDragHandle = function(e){
  var handleY = goog.style.getPosition(this._handleDom).y;

  var scrollTop = (this._outerDom.scrollHeight - this._outerHeight) * ( handleY / (this._scrollbarHeight - this._handleHeight) );
  this.scrollTo(scrollTop);
};


hlc.views.common.Scroller.prototype.onNativeScroll = function(e){
  this._draggable.update();
  this.onScrollUpdate();
};


hlc.views.common.Scroller.prototype.onScrollUpdate = function() {
  var scrollTop = - this._draggable.y;
  
  var scrollRatio = scrollTop / this._outerDom.scrollHeight;
  goog.style.setPosition(this._handleDom, 0, this._scrollbarHeight * scrollRatio);
};


hlc.views.common.Scroller.prototype.onResize = function (e) {
  this._outerHeight = goog.style.getSize(this._outerDom).height;
  this._scrollbarHeight = goog.style.getSize(this._scrollbarDom).height;

  var handleHeightRatio = this._outerHeight / this._outerDom.scrollHeight;
  this._handleHeight = this._scrollbarHeight * handleHeightRatio;
  goog.style.setHeight(this._handleDom, this._handleHeight);

  this._draggerLimits.height = this._scrollbarHeight - this._handleHeight;
  this._dragger.setLimits( this._draggerLimits );

  // show/hide scrollbar
  goog.style.showElement(this._scrollbarDom, (this._handleHeight < this._scrollbarHeight));

  // rescroll to last scroll position
  this.scrollTo(this._outerDom.scrollTop);
};