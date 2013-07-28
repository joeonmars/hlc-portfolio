goog.provide('hlc.views.mastheadpages.BiographyPage');

goog.require('hlc.views.mastheadpages.MastheadPage');
goog.require('hlc.models.AnimationModel');
goog.require('goog.dom');

/**
 * @constructor
 */
hlc.views.mastheadpages.BiographyPage = function(){
	var domElement = goog.dom.getElement('biography');
	var url = hlc.Url.INCLUDES + 'biography';

  goog.base(this, domElement, url, 'biography');
};
goog.inherits(hlc.views.mastheadpages.BiographyPage, hlc.views.mastheadpages.MastheadPage);


hlc.views.mastheadpages.BiographyPage.prototype.createPageElements = function(){
	goog.base(this, 'createPageElements');

	// add title tweeners
	var animaticTitleDoms = goog.dom.query('.animaticTitle', this.domElement);

	var titleTweeners = goog.array.map(animaticTitleDoms, function(animaticTitleDom) {
		return hlc.models.AnimationModel.getAnimaticTitleTweener(animaticTitleDom);
	});

	this._animateInTweener.add(titleTweeners, 0, "normal", .1);

	// add paragraph tweeners
	var outerDoms = goog.dom.query('.outer', this.domElement);

	var outerTweeners = goog.array.map(outerDoms, function(outerDom) {
		return TweenMax.fromTo(outerDom, .8, {opacity: 0}, {opacity: 1, ease: Strong.easeInOut});
	});

	this._animateInTweener.add(outerTweeners, .8, "normal", .2);
};


hlc.views.mastheadpages.BiographyPage.prototype.onResize = function(e){

};