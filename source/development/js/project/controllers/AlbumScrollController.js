goog.provide('hlc.controllers.AlbumScrollController');

goog.require('hlc.views.AlbumSection');
goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom.query');
goog.require('goog.async.Delay');

/**
 * @constructor
 */
hlc.controllers.AlbumScrollController = function(){
  goog.base(this);

  this.scrollPosition = 0;
  this.albumSections = [];

  this._tweener = null;
  this._locateDelay = new goog.async.Delay(this.locateAlbum, 1000, this);
  this._albumScrollDomElement = goog.dom.query('#album-scroller')[0];
  this._albumDomElements = goog.dom.getChildren(this._albumScrollDomElement);

  goog.array.forEach(this._albumDomElements, function(albumDomElement) {
  	this.albumSections.push( new hlc.views.AlbumSection( albumDomElement ) );
  }, this);
};
goog.inherits(hlc.controllers.AlbumScrollController, goog.events.EventTarget);
goog.addSingletonGetter(hlc.controllers.AlbumScrollController);


hlc.controllers.AlbumScrollController.prototype.init = function(){
	goog.array.forEach(this.albumSections, function(albumSection) {
  	albumSection.init();
  }, this);

	goog.events.listen(this._albumScrollDomElement, 'scroll', this.onScroll, false, this);
};


hlc.controllers.AlbumScrollController.prototype.locateAlbum = function(){
	var albumDomHeight = hlc.main.controllers.windowController.getMainViewportSize().height;
	var albumId = Math.round( this._albumScrollDomElement.scrollTop / albumDomHeight );
	var albumDom = this._albumDomElements[albumId];
	var albumDomY = albumDom.offsetTop - this._albumScrollDomElement.offsetTop;

	this.scrollPosition = albumDomY;

	// calculate duration
	var maxDuration = .8;
	var minDuration = .2;
	var scrollRatio = Math.abs(albumDomY - this._albumScrollDomElement.scrollTop) / (albumDomHeight/2);
	var duration = goog.math.lerp( minDuration, maxDuration, scrollRatio );

	// animate the scroll position
	this._tweener = TweenMax.to(this._albumScrollDomElement, duration, {
		scrollTo: {y: albumDomY},
		ease: Power2.easeOut,
		onComplete: function() {
			var ev = {
				type: hlc.controllers.AlbumScrollController.EventType.SCROLL_FINISH,
				scrollPosition: this.scrollPosition,
				albumSection: this.albumSections[albumId]
			};
			this.dispatchEvent(ev);
		},
		onCompleteScope: this
	});

	//console.log('nearest album is ', albumDom, ' y = ' + albumDomY);
};


hlc.controllers.AlbumScrollController.prototype.onScroll = function(e){
	this._locateDelay.start();
};


hlc.controllers.AlbumScrollController.EventType = {
	SCROLL_FINISH: 'scroll_finish'
};