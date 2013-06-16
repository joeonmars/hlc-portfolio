goog.provide('hlc.views.mastheadpages.HomePage');

goog.require('hlc.views.mastheadpages.MastheadPage');
goog.require('goog.dom');

/**
 * @constructor
 */
hlc.views.mastheadpages.HomePage = function(){
	var domElement = goog.dom.getElement('home');
	var url = hlc.Url.ORIGIN + 'home';

  goog.base(this, domElement, url);
};
goog.inherits(hlc.views.mastheadpages.HomePage, hlc.views.mastheadpages.MastheadPage);


hlc.views.mastheadpages.HomePage.prototype.onResize = function(e){

};