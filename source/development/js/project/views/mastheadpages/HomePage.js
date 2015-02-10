goog.provide('hlc.views.mastheadpages.HomePage');

goog.require('hlc.views.mastheadpages.MastheadPage');
goog.require('hlc.views.mastheadpages.Portrait');
goog.require('hlc.views.common.FrameButton');

/**
 * @constructor
 */
hlc.views.mastheadpages.HomePage = function(){

	var domElement = goog.dom.getElement('home');
	var url = hlc.Url.INCLUDES + 'home';

  goog.base(this, domElement, url, 'home');

  this._innerEl = null;
  this._portrait = null;
  this._buttons = null;
};
goog.inherits(hlc.views.mastheadpages.HomePage, hlc.views.mastheadpages.MastheadPage);


hlc.views.mastheadpages.HomePage.prototype.createPageElements = function(){
	
	goog.base(this, 'createPageElements');

	this._innerEl = goog.dom.getElementByClass('inner', this.domElement);

	this._portrait = new hlc.views.mastheadpages.Portrait();

	this._buttons = goog.array.map( goog.dom.query('.frame-button', this.domElement), function(el) {
		return new hlc.views.common.FrameButton( el );
	});
};


hlc.views.mastheadpages.HomePage.prototype.activate = function(){
	
	goog.base(this, 'activate');

	goog.dom.classes.enable( this.domElement, 'active', true );

	this._portrait.activate();

	goog.array.forEach(this._buttons, function(button){
		button.activate();
		this._eventHandler.listen(button.domElement, goog.events.EventType.CLICK, this.onClickButton, false, this);
	}, this);

	this._eventHandler.listen(hlc.main.controllers.mainScrollController,
		hlc.events.EventType.SCROLL_START, this.onScrollStart, false, this);

	this._eventHandler.listen(hlc.main.controllers.mainScrollController,
		hlc.events.EventType.SCROLL_COMPLETE, this.onScrollComplete, false, this);
};


hlc.views.mastheadpages.HomePage.prototype.deactivate = function(){

	goog.base(this, 'deactivate');

	goog.dom.classes.enable( this.domElement, 'active', false );

	this._portrait.deactivate();

	goog.array.forEach(this._buttons, function(button){
		button.deactivate();
	}, this);
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

	//console.log(e);
};