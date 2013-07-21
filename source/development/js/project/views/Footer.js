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
  this.photographyDom = goog.dom.query('[data-id = "photography"]', this.creditsDom)[0];
  this.titleDom = goog.dom.query('h3', this.creditsDom)[0];
  this.expandButton = goog.dom.query('.expandButton', this.creditsDom)[0];
  this.outerDom = goog.dom.query('.outer', this.creditsDom)[0];
  this.innerDom = goog.dom.query('.inner', this.creditsDom)[0];

  this.isExpanded = false;
};
goog.inherits(hlc.views.Footer, goog.events.EventTarget);


hlc.views.Footer.prototype.init = function(){
	goog.events.listen(hlc.main.controllers.mainScrollController,
		hlc.controllers.MainScrollController.EventType.SCROLL_START, this.onScrollStart, false, this);

	goog.events.listen(hlc.main.controllers.mainScrollController,
		hlc.controllers.MainScrollController.EventType.SCROLL_FINISH, this.onScrollFinish, false, this);

	goog.events.listen(this.titleDom, 'click', this.onClick, false, this);
};


hlc.views.Footer.prototype.up = function(toggle){
	if(toggle === true) goog.dom.classes.add(this.domElement, 'up');
	else goog.dom.classes.remove(this.domElement, 'up');
};


hlc.views.Footer.prototype.setBlack = function(toggle){
	if(toggle === true) {
		goog.dom.classes.add(this.domElement, 'black');
		goog.dom.classes.add(this.expandButton, 'black');
	}else {
		goog.dom.classes.remove(this.domElement, 'black');
		goog.dom.classes.remove(this.expandButton, 'black');
	}
};


hlc.views.Footer.prototype.setPhotographyCopyright = function(copyright) {
	var pDom = goog.dom.query('p', this.photographyDom)[0];

	if(goog.object.getCount(copyright) === 0) {
		// hide the photography copyright dom
		pDom.innerHTML = '';
		return;
	}

	pDom.innerHTML = '<a href="' + copyright['workUrl'] + '" target="_blank">' + copyright['workTitle'] + '</a>' +
		' by <a href="' + copyright['authorUrl'] + '" target="_blank">' + copyright['authorName'] + '</a>';
};


hlc.views.Footer.prototype.onScrollStart = function(e){
	if(e.scrollPosition === hlc.controllers.MainScrollController.ScrollPosition.MASTHEAD) {
		this.up(false);
	}else {
		this.setBlack(false);
	}
};


hlc.views.Footer.prototype.onScrollFinish = function(e){
	if(e.scrollPosition !== hlc.controllers.MainScrollController.ScrollPosition.MASTHEAD) {
		this.up(true);
	}
};


hlc.views.Footer.prototype.onClick = function(e){
	var innerHeight = goog.style.getSize(this.innerDom).height;

	TweenMax.killTweensOf(this.outerDom);

	if(this.isExpanded) {
		goog.dom.classes.addRemove(this.expandButton, 'downwards', 'upwards');
		TweenMax.to(this.outerDom, .5, {height: 0, opacity: 0, ease: Quad.easeInOut});
	}else {
		goog.dom.classes.addRemove(this.expandButton, 'upwards', 'downwards');
		TweenMax.to(this.outerDom, .5, {height: innerHeight, opacity: 1, ease: Quad.easeInOut});
	}

	this.isExpanded = !this.isExpanded;
};