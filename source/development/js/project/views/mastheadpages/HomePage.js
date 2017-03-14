goog.provide('hlc.views.mastheadpages.HomePage');

goog.require('hlc.views.mastheadpages.MastheadPage');
goog.require('hlc.views.common.FrameButton');

/**
 * @constructor
 */
hlc.views.mastheadpages.HomePage = function(){

	var domElement = goog.dom.getElement('home');
	var url = hlc.Url.INCLUDES + 'home';

  goog.base(this, domElement, url, 'home');

  this._innerEl = null;
  this._buttons = null;
};
goog.inherits(hlc.views.mastheadpages.HomePage, hlc.views.mastheadpages.MastheadPage);


hlc.views.mastheadpages.HomePage.prototype.createPageElements = function(){
	
	goog.base(this, 'createPageElements');

	this._innerEl = goog.dom.getElementByClass('inner', this.domElement);

	this._buttons = goog.array.map( goog.dom.query('.frame-button', this.domElement), function(el) {
		return new hlc.views.common.FrameButton( el );
	});
};


hlc.views.mastheadpages.HomePage.prototype.load = function(){

	this.onLoaded();
};


hlc.views.mastheadpages.HomePage.prototype.animateIn = function(){

	this.activate();
	this.goAmbient(false);
};


hlc.views.mastheadpages.HomePage.prototype.animateOut = function(){

	this.deactivate();
	this.goAmbient(true);
};


hlc.views.mastheadpages.HomePage.prototype.activate = function(){
	
	goog.base(this, 'activate');

	goog.dom.classes.enable( this.domElement, 'active', true );

	goog.array.forEach(this._buttons, function(button){
		button.activate();
		this._eventHandler.listen(button.domElement, goog.events.EventType.CLICK, this.onClickButton, false, this);
	}, this);

	this._eventHandler.listen(hlc.main.controllers.mainScrollController,
		hlc.events.EventType.SCROLL_START, this.onScrollStart, false, this);

	this._eventHandler.listen(hlc.main.controllers.mainScrollController,
		hlc.events.EventType.SCROLL_COMPLETE, this.onScrollComplete, false, this);

	// listen for credits event
	this._eventHandler.listen( hlc.main.views.credits, hlc.events.EventType.ANIMATE_IN_START, this.onCreditsAnimateIn, false, this );
	this._eventHandler.listen( hlc.main.views.credits, hlc.events.EventType.ANIMATE_OUT_START, this.onCreditsAnimateOut, false, this );
};


hlc.views.mastheadpages.HomePage.prototype.deactivate = function(){

	goog.base(this, 'deactivate');

	goog.dom.classes.enable( this.domElement, 'active', false );

	goog.array.forEach(this._buttons, function(button){
		button.deactivate();
	}, this);
};


hlc.views.mastheadpages.HomePage.prototype.goAmbient = function( shouldGo ){

	goog.dom.classlist.enable( this.domElement, 'ambient', shouldGo );
};


hlc.views.mastheadpages.HomePage.prototype.onClickButton = function(e){

	e.preventDefault();

	// set token
	var token = e.currentTarget.getAttribute('href');
	hlc.main.controllers.navigationController.setToken(token);
};


hlc.views.mastheadpages.HomePage.prototype.onScrollStart = function(e){

	if(e.scrollPosition === hlc.controllers.MainScrollController.ScrollPosition.MASTHEAD) {

		this.activate();

	}else {

		this.deactivate();
	}
};


hlc.views.mastheadpages.HomePage.prototype.onScrollComplete = function(e){


};


hlc.views.mastheadpages.HomePage.prototype.onCreditsAnimateIn = function(e){

	this.goAmbient( true );
};


hlc.views.mastheadpages.HomePage.prototype.onCreditsAnimateOut = function(e){

	this.goAmbient( false );
};