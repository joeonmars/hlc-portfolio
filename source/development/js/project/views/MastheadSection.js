goog.provide('hlc.views.MastheadSection');

goog.require('hlc.views.Section');
goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.dom.query');

/**
 * @constructor
 */
hlc.views.MastheadSection = function(domElement){
  goog.base(this, domElement);

  this.albumButton = goog.dom.query('.albumButton', this.domElement)[0];
};
goog.inherits(hlc.views.MastheadSection, hlc.views.Section);


hlc.views.MastheadSection.prototype.init = function(){
	goog.base(this, 'init');

	goog.events.listen(this.albumButton, 'click', this.onClick, false, this);
};


hlc.views.MastheadSection.prototype.onClick = function(e){
	switch(e.currentTarget) {
		case this.albumButton:
		hlc.main.controllers.mainScrollController.scrollTo(hlc.controllers.MainScrollController.ScrollPosition.ALBUM);
		break;
	}
};


hlc.views.MastheadSection.prototype.onScroll = function(e){
	goog.base(this, 'onScroll', e);
};


hlc.views.MastheadSection.prototype.onResize = function(e){
	goog.base(this, 'onResize', e);
	
	var albumButtonSize = goog.style.getSize(this.albumButton);
	var albumButtonX = (e.mainViewportSize.width - albumButtonSize.width) / 2;
	goog.style.setStyle(this.albumButton, 'left', albumButtonX + 'px');
};