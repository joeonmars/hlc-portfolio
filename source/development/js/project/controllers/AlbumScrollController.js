goog.provide('hlc.controllers.AlbumScrollController');

goog.require('hlc.views.AlbumSection');
goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom.query');
goog.require('goog.async.Delay');
goog.require('goog.userAgent');
goog.require('hlc.utils');

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

  if(!goog.userAgent.MOBILE) hlc.utils.grabCursor(this._albumScrollDomElement);

  goog.array.forEach(this._albumDomElements, function(albumDomElement) {
  	this.albumSections.push( new hlc.views.AlbumSection( albumDomElement ) );
  }, this);

  this.currentAlbumSection = null;

  this._scrollProps = {y1: 0, y2: 0, t1: 0, t2: 0, startY: 0, endY: 0, originalY: 0};
  this._isDragging = false;
};
goog.inherits(hlc.controllers.AlbumScrollController, goog.events.EventTarget);
goog.addSingletonGetter(hlc.controllers.AlbumScrollController);


hlc.controllers.AlbumScrollController.prototype.init = function(){
	goog.array.forEach(this.albumSections, function(albumSection) {
  	albumSection.init();
  }, this);

  goog.events.listen(this._albumScrollDomElement, hlc.events.EventType.DOWN, this.onDown, false, this);

	goog.events.listen(hlc.main.controllers.mainScrollController,
		hlc.controllers.MainScrollController.EventType.SCROLL_FINISH, this.onMainScrollFinish, false, this);

	hlc.main.controllers.navigationController.addDispatcher(this);
	goog.events.listen(this, goog.history.EventType.NAVIGATE, this.onNavigate, false, this);
};


hlc.controllers.AlbumScrollController.prototype.getPrevAlbum = function(){
	var lastAlbumSectionIndex = Math.max(goog.array.indexOf(this.albumSections, this.currentAlbumSection) - 1, 0);
 	var lastAlbumSection = this.albumSections[lastAlbumSectionIndex];

 	return lastAlbumSection;
};


hlc.controllers.AlbumScrollController.prototype.getNextAlbum = function(){
 	var nextAlbumSectionIndex = Math.min(goog.array.indexOf(this.albumSections, this.currentAlbumSection) + 1, this.albumSections.length - 1);
 	var nextAlbumSection = this.albumSections[nextAlbumSectionIndex];

 	return nextAlbumSection;
};


hlc.controllers.AlbumScrollController.prototype.locateAlbum = function(album){
	var albumSection = null;

	if(album) {
		albumSection = album;
	}else {
		var albumDomHeight = hlc.main.controllers.windowController.getMainViewportSize().height;
		var albumIndex = Math.round( this._albumScrollDomElement.scrollTop / albumDomHeight );
		albumSection = this.albumSections[albumIndex];
	}

	var albumId = albumSection.albumModel.albumId;
	var songId = albumSection.albumPlayer.getCurrentSong().songId;

	var token = 'album/' + albumId + '/' + songId;

	if(hlc.main.controllers.navigationController.getToken() === token) {
		this.scrollToAlbum( albumSection );
	}else {
		hlc.main.controllers.navigationController.setToken( token );
	}
};


hlc.controllers.AlbumScrollController.prototype.scrollToAlbum = function(albumSection, songId){
	var albumDomHeight = hlc.main.controllers.windowController.getMainViewportSize().height;
	var albumDom = albumSection.domElement;
	var albumDomY = albumDom.offsetTop - this._albumScrollDomElement.offsetTop;

	//if(this.scrollPosition === albumDomY) return;
	this.scrollPosition = albumDomY;

	// calculate duration
	var maxDuration = .6;
	var minDuration = .2;
	var scrollRatio = Math.abs(albumDomY - this._albumScrollDomElement.scrollTop) / (albumDomHeight/2);
	var duration = goog.math.lerp( minDuration, maxDuration, scrollRatio );

	// animate the scroll position
	this._tweener = TweenMax.to(this._albumScrollDomElement, duration, {
		scrollTo: {y: albumDomY},
		ease: Strong.easeOut,
		onStart: function() {
			var ev = {
				type: hlc.controllers.AlbumScrollController.EventType.SCROLL_START,
				scrollPosition: this.scrollPosition,
				albumSection: this.currentAlbumSection,
				songId: songId
			};

			this.dispatchEvent(ev);
		},
		onStartScope: this,
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


hlc.controllers.AlbumScrollController.prototype.onDown = function(e){
	this._locateDelay.stop();

	goog.events.listen(document, hlc.events.EventType.MOVE, this.onMove, false, this);
	goog.events.listen(document, hlc.events.EventType.UP, this.onUp, false, this);

	var touchY = hlc.utils.getTouchCoordinate(e).y;

  this._scrollProps.y1 = this._scrollProps.y2 = touchY;
  this._scrollProps.t1 = this._scrollProps.t2 = goog.now();

  this._scrollProps.startY = touchY;
  this._scrollProps.endY = touchY;

  this._scrollProps.originalY = this._albumScrollDomElement.scrollTop;
};


hlc.controllers.AlbumScrollController.prototype.onMove = function(e){
	this._isDragging = true;

	var touchY = hlc.utils.getTouchCoordinate(e).y;

  this._scrollProps.y2 = this._scrollProps.y1;
  this._scrollProps.t2 = this._scrollProps.t1;
  this._scrollProps.t1 = goog.now();
  this._scrollProps.y1 = touchY;
  this._scrollProps.endY = touchY;

  var offsetY = this._scrollProps.startY - touchY;
 	var scrollY = this._scrollProps.originalY + offsetY;
 	this._albumScrollDomElement.scrollTop = scrollY;
};


hlc.controllers.AlbumScrollController.prototype.onUp = function(e){
	goog.events.unlisten(document, hlc.events.EventType.MOVE, this.onMove, false, this);
	goog.events.unlisten(document, hlc.events.EventType.UP, this.onUp, false, this);

	if(!this._isDragging) return false;
	else this._isDragging = false;

  var elapsedTime = (goog.now() - this._scrollProps.t2) / 1000;
 	var threshold = 100;
 	var viewportMid = hlc.main.controllers.windowController.getMainViewportSize().height / 2;
	var velocity = (this._scrollProps.endY - this._scrollProps.y2) / elapsedTime;
	var scrolledDistance = this._scrollProps.endY - this._scrollProps.startY;

  if(velocity > threshold || scrolledDistance > viewportMid) {

 		// go up
 		this.locateAlbum( this.getPrevAlbum() );

  }else if(velocity < -threshold || scrolledDistance < - viewportMid) {

 		// go down
		this.locateAlbum( this.getNextAlbum() );

  }else {

 		// go back to the current
 		this.locateAlbum( this.currentAlbumSection );

  }
};


hlc.controllers.AlbumScrollController.prototype.onMainScrollFinish = function(e){
	if(e.scrollPosition === hlc.controllers.MainScrollController.ScrollPosition.ALBUM) {
		this._locateDelay.start();
	}
};


hlc.controllers.AlbumScrollController.prototype.onNavigate = function(e){
	// check if the token contains album id and song id
	var tokens = e.token.split('/');
	if(tokens[tokens.length - 1] == '') tokens.pop();

	if(tokens[0] === 'album' && tokens.length > 2) {
		var albumId = tokens[1];
		var songId = (tokens.length === 3) ? tokens[2] : null;

		var albumSection = goog.array.find(this.albumSections, function(albumSection) {
			return albumSection.albumModel.albumId === albumId;
		});

		if(albumSection) this.scrollToAlbum(albumSection, songId);
	}
};


hlc.controllers.AlbumScrollController.EventType = {
	SCROLL_START: 'scroll_start',
	SCROLL_FINISH: 'scroll_finish'
};