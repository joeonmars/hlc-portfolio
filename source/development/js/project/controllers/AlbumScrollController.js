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

  this.currentAlbumSection = null;
};
goog.inherits(hlc.controllers.AlbumScrollController, goog.events.EventTarget);
goog.addSingletonGetter(hlc.controllers.AlbumScrollController);


hlc.controllers.AlbumScrollController.prototype.init = function(){
	goog.array.forEach(this.albumSections, function(albumSection) {
  	albumSection.init();
  }, this);

	goog.events.listen(this._albumScrollDomElement, 'scroll', this.onScroll, false, this);

	goog.events.listen(hlc.main.controllers.mainScrollController,
		hlc.controllers.MainScrollController.EventType.SCROLL_FINISH, this.onMainScrollFinish, false, this);

	hlc.main.controllers.navigationController.addDispatcher(this);
	goog.events.listen(this, goog.history.EventType.NAVIGATE, this.onNavigate, false, this);
};


hlc.controllers.AlbumScrollController.prototype.locateAlbum = function(){
	var albumDomHeight = hlc.main.controllers.windowController.getMainViewportSize().height;
	var albumIndex = Math.round( this._albumScrollDomElement.scrollTop / albumDomHeight );
	var albumSection = this.albumSections[albumIndex];
	var albumId = albumSection.albumModel.albumId;
	var songId = albumSection.albumPlayer.getCurrentSong().songId;

	var token = 'album/' + albumId + '/' + songId;

	if(hlc.main.controllers.navigationController.getToken() === token) {
		this.scrollToAlbum( this.currentAlbumSection );
	}else {
		hlc.main.controllers.navigationController.setToken( token );
	}
};


hlc.controllers.AlbumScrollController.prototype.scrollToAlbum = function(albumSection, songId){
	var albumDomHeight = hlc.main.controllers.windowController.getMainViewportSize().height;
	var albumDom = albumSection.domElement;
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
			if(this.currentAlbumSection === albumSection) return;
			else this.currentAlbumSection = albumSection;

			var ev = {
				type: hlc.controllers.AlbumScrollController.EventType.SCROLL_FINISH,
				scrollPosition: this.scrollPosition,
				albumSection: this.currentAlbumSection,
				songId: songId
			};
			this.dispatchEvent(ev);
		},
		onCompleteScope: this
	});
};


hlc.controllers.AlbumScrollController.prototype.onMainScrollFinish = function(e){
	if(e.scrollPosition === hlc.controllers.MainScrollController.ScrollPosition.ALBUM) {
		this._locateDelay.start();
	}
};


hlc.controllers.AlbumScrollController.prototype.onScroll = function(e){
	this._locateDelay.start();
};


hlc.controllers.AlbumScrollController.prototype.onNavigate = function(e){
	// check if the token contains album id and song id
	var tokens = e.token.split('/');
	if(tokens[tokens.length - 1] == '') tokens.pop();

	if(tokens[0] === 'album' && tokens.length > 2) {
		var albumId = tokens[1];
		var songId = (tokens.length === 3) ? tokens[2] : null;

		if(!this.currentAlbumSection || this.currentAlbumSection.albumModel.albumId !== albumId) {
			var albumSection = goog.array.find(this.albumSections, function(albumSection) {
				return albumSection.albumModel.albumId === albumId;
			});

			if(albumSection) this.scrollToAlbum(albumSection, songId);
		}
	}
};


hlc.controllers.AlbumScrollController.EventType = {
	SCROLL_FINISH: 'scroll_finish'
};