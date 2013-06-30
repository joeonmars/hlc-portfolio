goog.provide('hlc.views.Footer');

goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.dom.classes');

/**
 * @constructor
 */
hlc.views.Footer = function(){
  goog.base(this);

  this.domElement = goog.dom.getElement('footer');
  this.creditsDom = goog.dom.getElement('credits');
};
goog.inherits(hlc.views.Footer, goog.events.EventTarget);


hlc.views.Footer.prototype.init = function(){
	goog.events.listen(hlc.main.controllers.mainScrollController,
		hlc.controllers.MainScrollController.EventType.SCROLL_START, this.onScrollStart, false, this);

	goog.events.listen(hlc.main.controllers.mainScrollController,
		hlc.controllers.MainScrollController.EventType.SCROLL_FINISH, this.onScrollFinish, false, this);
};


hlc.views.Footer.prototype.up = function(toggle){
	if(toggle === true) goog.dom.classes.add(this.domElement, 'up');
	else goog.dom.classes.remove(this.domElement, 'up');
};


hlc.views.Footer.prototype.blackify = function(toggle){
	if(toggle === true) goog.dom.classes.add(this.domElement, 'black');
	else goog.dom.classes.remove(this.domElement, 'black');
};


hlc.views.Footer.prototype.onScrollStart = function(e){
	if(e.scrollPosition === hlc.controllers.MainScrollController.ScrollPosition.MASTHEAD) {
		this.up(false);
	}
};


hlc.views.Footer.prototype.onScrollFinish = function(e){
	if(e.scrollPosition !== hlc.controllers.MainScrollController.ScrollPosition.MASTHEAD) {
		this.up(true);
	}
};