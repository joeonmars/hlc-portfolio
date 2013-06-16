goog.provide('hlc.views.mastheadpages.BiographyPage');

goog.require('hlc.views.mastheadpages.MastheadPage');
goog.require('goog.dom');

/**
 * @constructor
 */
hlc.views.mastheadpages.BiographyPage = function(){
	var domElement = goog.dom.getElement('biography');
	var url = hlc.Url.ORIGIN + 'biography';

  goog.base(this, domElement, url);
};
goog.inherits(hlc.views.mastheadpages.BiographyPage, hlc.views.mastheadpages.MastheadPage);


hlc.views.mastheadpages.BiographyPage.prototype.onResize = function(e){

};