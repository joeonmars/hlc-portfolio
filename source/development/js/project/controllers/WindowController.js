goog.provide('hlc.controllers.WindowController');

goog.require('goog.array');
goog.require('goog.dom.ViewportSizeMonitor');
goog.require('goog.events.EventType');
goog.require('goog.dom.query');
goog.require('goog.userAgent');

hlc.controllers.WindowController = function() {
	goog.base(this);

	this._dispatchers = [];

	this._viewportSizeMonitor = new goog.dom.ViewportSizeMonitor();
	this._window = goog.dom.getWindow();
	this._mainViewport = goog.dom.query('#main-container > .viewport')[0];
	this._scrollBarWidth = goog.userAgent.WEBKIT ? 6 : goog.style.getScrollbarWidth();

	// disable dragging viewport for mobile
	if(goog.userAgent.MOBILE) {
	  goog.events.listen(document, 'touchmove', function(e) {
	  	e.preventDefault();
	  });
	}

  // listen for window events
  goog.events.listen(this._viewportSizeMonitor, goog.events.EventType.RESIZE, this.onResize, false, this);
  goog.events.listen(this._window, 'orientationchange', this.onOrientationChange, false, this);
};
goog.inherits(hlc.controllers.WindowController, goog.events.EventTarget);
goog.addSingletonGetter(hlc.controllers.WindowController);


hlc.controllers.WindowController.prototype.addDispatcher = function(dispatcher) {
	if(!goog.array.contains(this._dispatchers, dispatcher)) {
		this._dispatchers.push(dispatcher);

		var ev = this.getResizeEvent();
		dispatcher.dispatchEvent(ev);
	}
};


hlc.controllers.WindowController.prototype.removeDispatcher = function(dispatcher) {
	if(goog.array.contains(this._dispatchers, dispatcher)) {
		goog.array.remove(this._dispatchers, dispatcher);
	}
};


hlc.controllers.WindowController.prototype.getScrollbarWidth = function() {
	return this._scrollBarWidth;
};


hlc.controllers.WindowController.prototype.getWindowSize = function() {
	return (this._viewportSizeMonitor.getSize() || goog.dom.getViewportSize());
};


hlc.controllers.WindowController.prototype.getMainViewportSize = function() {
	return goog.style.getSize(this._mainViewport);
};


hlc.controllers.WindowController.prototype.getResizeEvent = function() {
	var ev = {
		type: goog.events.EventType.RESIZE,
		windowSize: this.getWindowSize(),
		mainViewportSize: this.getMainViewportSize(),
		scrollbarWidth: this.getScrollbarWidth()
	};

	return ev;
};


hlc.controllers.WindowController.prototype.onResize = function(e) {
	var ev = this.getResizeEvent();

	goog.array.forEach(this._dispatchers, function(dispatcher) {
		dispatcher.dispatchEvent(ev);
	});
};


hlc.controllers.WindowController.prototype.onOrientationChange = function(e) {

};