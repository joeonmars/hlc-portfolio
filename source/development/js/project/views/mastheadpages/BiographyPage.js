goog.provide('hlc.views.mastheadpages.BiographyPage');

goog.require('hlc.views.mastheadpages.MastheadPage');
goog.require('hlc.models.AnimationModel');
goog.require('hlc.views.common.Scroller');
goog.require('hlc.views.common.DummyScroller');

/**
 * @constructor
 */
hlc.views.mastheadpages.BiographyPage = function(){

	var domElement = goog.dom.getElement('biography');
	var url = hlc.Url.INCLUDES + 'biography';

  goog.base(this, domElement, url, 'biography');

  this._scrollbarEl = null;
  this._dummyEl = null;

  this._scroller = null;
};
goog.inherits(hlc.views.mastheadpages.BiographyPage, hlc.views.mastheadpages.MastheadPage);


hlc.views.mastheadpages.BiographyPage.prototype.createPageElements = function(){

	goog.base(this, 'createPageElements');

  this._scrollbarEl = goog.dom.getElementByClass('scrollbar', this.domElement);
  this._dummyEl = goog.dom.getElementByClass('dummy-scroller', this.domElement);

  this._scroller = goog.userAgent.MOBILE ?
  	new hlc.views.common.Scroller(this.domElement, this._scrollbarEl) :
  	new hlc.views.common.DummyScroller(this.domElement, this._dummyEl, this._scrollbarEl);
};


hlc.views.mastheadpages.BiographyPage.prototype.activate = function(){

	goog.base(this, 'activate');

	this._scroller.activate();
};


hlc.views.mastheadpages.BiographyPage.prototype.deactivate = function(){

	goog.base(this, 'deactivate');

	this._scroller.deactivate();
};


hlc.views.mastheadpages.BiographyPage.prototype.onResize = function(e){

};