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
  //this.creditsDom = goog.dom.getElement('credits');

  //this.photographyDom = goog.dom.query('[data-id = "photography"]', this.creditsDom)[0];
  //this.defaultPhotographyAuthorHTML = goog.dom.query('a', this.photographyDom)[0].outerHTML;
};
goog.inherits(hlc.views.Footer, goog.events.EventTarget);


hlc.views.Footer.prototype.init = function(){

	goog.events.listen(hlc.main.controllers.mainScrollController,
		hlc.controllers.MainScrollController.EventType.SCROLL_START, this.onMainScrollStart, false, this);

	goog.events.listen(hlc.main.controllers.mainScrollController,
		hlc.controllers.MainScrollController.EventType.SCROLL_FINISH, this.onMainScrollFinish, false, this);

	goog.events.listen(hlc.main.controllers.albumScrollController,
		hlc.controllers.AlbumScrollController.EventType.SCROLL_START, this.onAlbumScrollStart, false, this);
};


hlc.views.Footer.prototype.up = function(toggle){

	goog.dom.classes.enable(this.domElement, 'up', toggle);
};


hlc.views.Footer.prototype.updatePhotography = function(artwork) {
	var authorDomWrapper = goog.dom.createDom('div');
	authorDomWrapper.innerHTML = this.defaultPhotographyAuthorHTML;

	var oldAuthorDom = goog.dom.query('a', this.photographyDom)[0];
	var newAuthorDom = goog.dom.query('a', authorDomWrapper)[0];

	if(artwork['authorName'].length > 0) {
		newAuthorDom.innerHTML = artwork['authorName'];

		if(artwork['authorUrl'].length > 0) {
			newAuthorDom.setAttribute('href', artwork['authorUrl']);
		}else {
			newAuthorDom.removeAttribute('href');
		}
	}

	goog.dom.replaceNode(newAuthorDom, oldAuthorDom);
};


hlc.views.Footer.prototype.open = function(){
	TweenMax.killTweensOf(this.outerDom);

	this.isExpanded = true;

	var innerHeight = goog.style.getSize(this.innerDom).height;

	goog.dom.classes.addRemove(this.expandButton, 'upwards', 'downwards');
	TweenMax.to(this.outerDom, .5, {height: innerHeight, opacity: 1, ease: Quad.easeInOut});
};


hlc.views.Footer.prototype.onMainScrollStart = function(e){

	if(e.scrollPosition === hlc.controllers.MainScrollController.ScrollPosition.MASTHEAD) {
		this.up(false);
	}
};


hlc.views.Footer.prototype.onAlbumScrollStart = function(e){


};


hlc.views.Footer.prototype.onMainScrollFinish = function(e){

	if(e.scrollPosition !== hlc.controllers.MainScrollController.ScrollPosition.MASTHEAD) {

		this.up(true);
		goog.events.listen(this.domElement, 'click', this.onClick, false, this);

	}else {

		goog.events.unlisten(this.domElement, 'click', this.onClick, false, this);
	}
};


hlc.views.Footer.prototype.onClick = function(e){

	console.log("CLICK CREDITS");
	//hlc.main.views.credits.show();
};