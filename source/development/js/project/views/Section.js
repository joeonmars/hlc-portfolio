goog.provide('hlc.views.Section');

goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');

/**
 * @constructor
 */
hlc.views.Section = function(domElement){
  goog.base(this);

  this.domElement = domElement;
  this.parentDomElement = goog.dom.getParentElement(this.domElement);
};
goog.inherits(hlc.views.Section, goog.events.EventTarget);


hlc.views.Section.prototype.init = function(){
	goog.events.listen(this, 'resize', this.onResize, false, this);
	hlc.main.controllers.windowController.addDispatcher(this);
};


hlc.views.Section.prototype.onScroll = function(e){
	
};


hlc.views.Section.prototype.onResize = function(e){

};