goog.provide('hlc.views.MastheadSection');

goog.require('hlc.views.Section');
goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.async.Delay');
goog.require('hlc.views.MastheadNav');
goog.require('hlc.views.mastheadpages.HomePage');
goog.require('hlc.views.mastheadpages.BiographyPage');
goog.require('hlc.views.mastheadpages.AwardsPage');
goog.require('hlc.views.mastheadpages.ContactPage');

/**
 * @constructor
 */
hlc.views.MastheadSection = function(domElement){
  goog.base(this, domElement);

  this.pagesDomElement = goog.dom.query('.pages', this.domElement)[0];
  this.headingDomElement = goog.dom.query('.marquee .heading', this.domElement)[0];
  this.marqueeDomElement = goog.dom.query('.marquee > div')[0];
  this.colorOverlayDomElement = goog.dom.query('.colorOverlay', this.domElement)[0];
  this.albumButton = goog.dom.query('.albumButton', this.domElement)[0];
  this.nav = null;
  this.pages = null;
  this.pageToLoad = null;

  this._pageTweener = null;
  this._headingTweener = null;

  this._scrollOnResizeDelay = new goog.async.Delay(this.toPage, 200, this);
};
goog.inherits(hlc.views.MastheadSection, hlc.views.Section);


hlc.views.MastheadSection.prototype.init = function(){
	goog.base(this, 'init');

	// create navigation
	this.nav = new hlc.views.MastheadNav;

	// create pages
	this.pages = {
		'home': new hlc.views.mastheadpages.HomePage,
		'biography': new hlc.views.mastheadpages.BiographyPage,
		'awards': new hlc.views.mastheadpages.AwardsPage,
		'contact': new hlc.views.mastheadpages.ContactPage
	};

	this.indexedPages = [
		this.pages['home'],
		this.pages['biography'],
		this.pages['awards'],
		this.pages['contact']
	];

	// listen for events
	goog.events.listen(this.albumButton, 'click', this.onClick, false, this);

	goog.events.listen(hlc.main.controllers.mainScrollController,
		hlc.controllers.MainScrollController.EventType.SCROLL_FINISH, this.onScrollFinish, false, this);

	goog.events.listen(this, hlc.views.MastheadSection.EventType.PAGE_LOADED, this.onPageLoaded, false, this);

	hlc.main.controllers.navigationController.addDispatcher(this);
	goog.events.listen(this, goog.history.EventType.NAVIGATE, this.onNavigate, false, this);
};


hlc.views.MastheadSection.prototype.toPage = function(page){
	// load page
	this.pageToLoad = page || this.pageToLoad;
	this.pageToLoad.load();

	// animate page
	var pageOffsetLeft = this.pageToLoad.getOffsetLeft();

	if(this._pageTweener) this._pageTweener.kill();

	this._pageTweener = TweenMax.to(this.pagesDomElement, .7, {
		scrollTo: {x: pageOffsetLeft},
		ease: Power2.easeInOut
	});

	// animate heading
	var headingWidth = goog.style.getSize(this.headingDomElement).width;
	var pageIndex = goog.array.indexOf(this.indexedPages, this.pageToLoad);
	var headingOffsetLeft = pageIndex * headingWidth;

	if(this._headingTweener) this._headingTweener.kill();

	this._headingTweener = TweenMax.to(this.headingDomElement, .5, {
		scrollTo: {x: headingOffsetLeft},
		ease: Power2.easeInOut
	});

	// animate color overlay
	goog.style.setOpacity(this.colorOverlayDomElement, (pageIndex > 0) ? 1 : 0);

	// animate marquee
	if(pageIndex === 0) {
		goog.dom.classes.add(this.marqueeDomElement, 'hide');
	}else {
		goog.dom.classes.remove(this.marqueeDomElement, 'hide');
	}

	// set nav active button
	this.nav.setActiveButton( this.nav.buttons[pageIndex] );
};


hlc.views.MastheadSection.prototype.onClick = function(e){
	switch(e.currentTarget) {
		case this.albumButton:
		goog.dom.classes.add(this.albumButton, 'hide');
		hlc.main.controllers.mainScrollController.scrollTo(hlc.controllers.MainScrollController.ScrollPosition.ALBUM);
		break;
	}
};


hlc.views.MastheadSection.prototype.onScrollFinish = function(e){
	if(e.scrollPosition === hlc.controllers.MainScrollController.ScrollPosition.MASTHEAD) {
		goog.dom.classes.remove(this.albumButton, 'hide');
	}else {
		goog.dom.classes.add(this.albumButton, 'hide');
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
	
	var albumButtonSize = goog.style.getSize(this.albumButton);
	var albumButtonX = (e.mainViewportSize.width - albumButtonSize.width) / 2;
	goog.style.setStyle(this.albumButton, 'left', albumButtonX + 'px');

	if(this.pageToLoad) {
		this._scrollOnResizeDelay.start();
	}
};


hlc.views.MastheadSection.EventType = {
	PAGE_LOADED: 'page_loaded'
};