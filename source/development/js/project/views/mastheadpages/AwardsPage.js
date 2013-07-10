goog.provide('hlc.views.mastheadpages.AwardsPage');

goog.require('hlc.views.mastheadpages.MastheadPage');
goog.require('goog.dom');

/**
 * @constructor
 */
hlc.views.mastheadpages.AwardsPage = function(){
	var domElement = goog.dom.getElement('awards');
	var url = hlc.Url.ORIGIN + 'awards';

  goog.base(this, domElement, url, 'awards');

};
goog.inherits(hlc.views.mastheadpages.AwardsPage, hlc.views.mastheadpages.MastheadPage);


hlc.views.mastheadpages.AwardsPage.prototype.onResize = function(e){

};