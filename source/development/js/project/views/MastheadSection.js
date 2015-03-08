goog.provide('hlc.views.MastheadSection');

goog.require('hlc.views.Section');
goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.async.Delay');
goog.require('hlc.views.mastheadpages.HomePage');
goog.require('hlc.views.mastheadpages.BiographyPage');

/**
 * @constructor
 */
hlc.views.MastheadSection = function(domElement){

  goog.base(this, domElement);

  this.pagesDom = goog.dom.query('.pages', this.domElement)[0];
  this.pageContainerDom = goog.dom.query('.pageContainer', this.pagesDom)[0];
  this.marqueeContainerDom = goog.dom.query('.marqueeContainer', this.domElement)[0];
  this.marqueeDom = goog.dom.query('.marquee', this.domElement)[0];
  this.marqueeContentDom = goog.dom.query('.content', this.marqueeDom)[0];
  this.headingDom = goog.dom.query('.heading', this.marqueeDom)[0];
  this.pages = null;
  this.pageToLoad = null;
};
goog.inherits(hlc.views.MastheadSection, hlc.views.Section);


hlc.views.MastheadSection.prototype.init = function(){

	goog.base(this, 'init');

	// create pages
	this.pages = {
		'home': new hlc.views.mastheadpages.HomePage,
		'biography': new hlc.views.mastheadpages.BiographyPage
	};

	// listen for events
	goog.events.listen(hlc.main.controllers.mainScrollController,
		hlc.events.EventType.SCROLL_START, this.onScrollStart, false, this);

	goog.events.listen(hlc.main.controllers.mainScrollController,
		hlc.events.EventType.SCROLL_COMPLETE, this.onScrollFinish, false, this);

	goog.events.listen(this, hlc.views.MastheadSection.EventType.PAGE_LOADED, this.onPageLoaded, false, this);

	hlc.main.controllers.navigationController.addDispatcher(this);
	goog.events.listen(this, goog.history.EventType.NAVIGATE, this.onNavigate, false, this);
};


hlc.views.MastheadSection.prototype.toPage = function(page){

	// animate out old page
	if(this.pageToLoad) {
		this.pageToLoad.animateOut();
	}

	// load page
	this.pageToLoad = page || this.pageToLoad;
	this.pageToLoad.load();

	// animate in new page
	this.pageToLoad.animateIn();
};


hlc.views.MastheadSection.prototype.onScrollStart = function(e){
	if(e.scrollPosition === hlc.controllers.MainScrollController.ScrollPosition.MASTHEAD) {

	}else {

	}
};


hlc.views.MastheadSection.prototype.onScrollFinish = function(e){
	if(e.scrollPosition === hlc.controllers.MainScrollController.ScrollPosition.MASTHEAD) {

	}else {

	}
};


hlc.views.MastheadSection.prototype.onPageLoaded = function(e){

};


hlc.views.MastheadSection.prototype.onNavigate = function(e){
	var pageToLoad = this.pages[e.token];

	// if page token exists, load the page
	if(pageToLoad) {
		this.toPage(pageToLoad);
	}
};


hlc.views.MastheadSection.prototype.onResize = function(e){
	goog.base(this, 'onResize', e);
	
	// set marquee heading position
	var marqueeHeight = goog.style.getSize(this.marqueeContainerDom).height * .38; //percent set in css;
	var headingHeight = goog.style.getSize(this.headingDom).height;
	goog.style.setStyle(this.marqueeContentDom, 'margin-top', (marqueeHeight - headingHeight) * .5 + 'px');
};


hlc.views.MastheadSection.EventType = {
	PAGE_LOADED: 'page_loaded'
};