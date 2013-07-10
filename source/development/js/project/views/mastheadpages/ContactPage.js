goog.provide('hlc.views.mastheadpages.ContactPage');

goog.require('hlc.views.mastheadpages.MastheadPage');
goog.require('goog.dom');

/**
 * @constructor
 */
hlc.views.mastheadpages.ContactPage = function(){
	var domElement = goog.dom.getElement('contact');
	var url = hlc.Url.ORIGIN + 'contact';

  goog.base(this, domElement, url, 'contact');
};
goog.inherits(hlc.views.mastheadpages.ContactPage, hlc.views.mastheadpages.MastheadPage);


hlc.views.mastheadpages.ContactPage.prototype.onResize = function(e){

};