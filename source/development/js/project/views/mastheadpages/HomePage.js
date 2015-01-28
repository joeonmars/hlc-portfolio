goog.provide('hlc.views.mastheadpages.HomePage');

goog.require('hlc.views.mastheadpages.MastheadPage');
goog.require('hlc.views.mastheadpages.Portrait');

/**
 * @constructor
 */
hlc.views.mastheadpages.HomePage = function(){

	var domElement = goog.dom.getElement('home');
	var url = hlc.Url.INCLUDES + 'home';

  goog.base(this, domElement, url, 'home');

  this._portrait = null;
};
goog.inherits(hlc.views.mastheadpages.HomePage, hlc.views.mastheadpages.MastheadPage);


hlc.views.mastheadpages.HomePage.prototype.createPageElements = function(){
	
	goog.base(this, 'createPageElements');

	this._portrait = new hlc.views.mastheadpages.Portrait();
};


hlc.views.mastheadpages.HomePage.prototype.activate = function(){

	goog.base(this, 'activate');

	this._portrait.activate();
};


hlc.views.mastheadpages.HomePage.prototype.deactivate = function(){

	goog.base(this, 'deactivate');

	this._portrait.deactivate();
};


hlc.views.mastheadpages.HomePage.prototype.onResize = function(e){

};