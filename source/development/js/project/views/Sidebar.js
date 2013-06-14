goog.provide('hlc.views.Sidebar');

goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');

/**
 * @constructor
 */
hlc.views.Sidebar = function(){
  goog.base(this);

  this.domElement = goog.dom.getElement('sidebar');
  this.isSlidedIn = false;

  this._size = goog.style.getSize(this.domElement);
  this._mainScrollerDomElement = goog.dom.getElement('main-scroller');
};
goog.inherits(hlc.views.Sidebar, goog.events.EventTarget);


hlc.views.Sidebar.prototype.init = function(){
	hlc.main.controllers.windowController.addDispatcher(this);
	goog.events.listen(this, 'resize', this.onResize, false, this);
};


hlc.views.Sidebar.prototype.toggle = function(){
	if(this.isSlidedIn) this.slideOut();
	else this.slideIn();
};


hlc.views.Sidebar.prototype.slideIn = function(){
	this.isSlidedIn = true;

	var mainViewportWidth = hlc.main.controllers.windowController.getMainViewportSize().width;
	var targetMainScrollerWidth = mainViewportWidth - this._size.width;

	goog.style.setStyle(this._mainScrollerDomElement, 'width', targetMainScrollerWidth + 'px');
};


hlc.views.Sidebar.prototype.slideOut = function(){
	this.isSlidedIn = false;

	goog.style.setStyle(this._mainScrollerDomElement, 'width', '100%');
};


hlc.views.Sidebar.prototype.onResize = function(e){
	if(this.isSlidedIn) this.slideIn();
};