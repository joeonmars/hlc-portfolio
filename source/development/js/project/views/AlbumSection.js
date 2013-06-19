goog.provide('hlc.views.AlbumSection');

goog.require('hlc.models.AlbumModel');
goog.require('hlc.views.Section');
goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.dom.query');

/**
 * @constructor
 */
hlc.views.AlbumSection = function(domElement){
  goog.base(this, domElement);

  this.albumModel = null;
};
goog.inherits(hlc.views.AlbumSection, hlc.views.Section);


hlc.views.AlbumSection.prototype.init = function(){
	goog.base(this, 'init');

	var albumId = this.domElement.getAttribute('data-id');
	this.albumModel = new hlc.models.AlbumModel(albumId);

	console.log(this.albumModel);
};


hlc.views.AlbumSection.prototype.onNavigate = function(e){

};


hlc.views.AlbumSection.prototype.onResize = function(e){
	goog.base(this, 'onResize', e);

};