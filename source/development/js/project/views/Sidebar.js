goog.provide('hlc.views.Sidebar');

goog.require('goog.events.EventTarget');
goog.require('goog.events.EventHandler');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.net.XhrIo');
goog.require('hlc.utils');
goog.require('hlc.views.common.Scroller');

/**
 * @constructor
 */
hlc.views.Sidebar = function(){
  goog.base(this);

  this.domElement = goog.dom.getElement('sidebar');
  this.outerDom = goog.dom.getElementByClass('outer', this.domElement);
  this.contentDom = goog.dom.getElementByClass('content', this.domElement);
  this.closeButtonDom = goog.dom.getElementByClass('closeButton', this.domElement);
  this.scrollbarDom = goog.dom.getElementByClass('scrollbar', this.domElement);

  this.isSlidedIn = false;

  this._size = null;
  this._mainScrollerDomElement = goog.dom.getElement('main-scroller');

  this._contentDomElements = {
  	'albumId': {'songId': ''}
  };

  this._suggestedSongButtons = [];
  this._shareButtons = [];

  this._scroller = new hlc.views.common.Scroller(this.outerDom, this.scrollbarDom);

  this._slideTweener = null;

  this._request = new goog.net.XhrIo();

  this._contentEventHandler = new goog.events.EventHandler(this);

  this._contentAnimateInTweener = null;
  this._contentAnimateOutTweener = null;

  this._contentHtml = null;
};
goog.inherits(hlc.views.Sidebar, goog.events.EventTarget);


hlc.views.Sidebar.prototype.init = function(){

	this._size = goog.style.getSize(this.domElement);

	hlc.main.controllers.windowController.addDispatcher(this);
	goog.events.listen(this, 'resize', this.onResize, false, this);

	// listen for click event
	goog.events.listen(this.closeButtonDom, 'click', this.onClick, false, this);

	// listen for main scroll event
	goog.events.listen(hlc.main.controllers.mainScrollController,
		hlc.events.EventType.SCROLL_START, this.onMainScrollStart, false, this);

	// listen for album scroll event
	goog.events.listen(hlc.main.controllers.albumScrollController,
		hlc.events.EventType.SCROLL_COMPLETE,
		this.onAlbumScrollFinish, false, this);

	// listen for song change event from every album player
	goog.array.forEach(hlc.main.views.albumSections, function(albumSection) {
		var albumPlayer = albumSection.albumPlayer;
		goog.events.listen(albumPlayer, hlc.views.AlbumPlayer.EventType.SONG_CHANGED, this.onSongChanged, false, this);
	}, this);
};


hlc.views.Sidebar.prototype.toggle = function(){
	if(this.isSlidedIn) this.slideOut();
	else this.slideIn();
};


hlc.views.Sidebar.prototype.slideIn = function(){
	this.isSlidedIn = true;

	var mainViewportWidth = hlc.main.controllers.windowController.getMainViewportSize().width;
	var targetMainScrollerWidth = mainViewportWidth - this._size.width;

	this._slideTweener = TweenMax.to(this._mainScrollerDomElement, .8, {
		'width': targetMainScrollerWidth,
		'ease': Cubic.easeInOut,
		'onStart': function() {
			this.dispatchEvent({type: hlc.views.Sidebar.EventType.SLIDE_IN})
		},
		'onStartScope': this,
		'onUpdate': function() {
			hlc.main.views.mainHud.mediaPlayer.resize();
			hlc.main.controllers.albumScrollController.resize();
		},
		'onComplete': function() {
			this.dispatchEvent({type: hlc.views.Sidebar.EventType.SLIDED_IN})
		},
		'onCompleteScope': this
	});

	goog.dom.classes.remove(this.closeButtonDom, 'hide');

	this._scroller.activate();
};


hlc.views.Sidebar.prototype.slideOut = function(){
	this.isSlidedIn = false;

	this._slideTweener = TweenMax.to(this._mainScrollerDomElement, .8, {
		'width': '100%',
		'ease': Cubic.easeInOut,
		'onStart': function() {
			this.dispatchEvent({type: hlc.views.Sidebar.EventType.SLIDE_OUT})
		},
		'onStartScope': this,
		'onUpdate': function() {
			hlc.main.views.mainHud.mediaPlayer.resize();
			hlc.main.controllers.albumScrollController.resize();
		},
		'onComplete': function() {
			this.dispatchEvent({type: hlc.views.Sidebar.EventType.SLIDED_OUT})
		},
		'onCompleteScope': this
	});

	goog.dom.classes.add(this.closeButtonDom, 'hide');

	this._scroller.deactivate();
};


hlc.views.Sidebar.prototype.animateInContent = function(){
	// replace dom elements
	this.contentDom.innerHTML = this._contentHtml;

	// add event listeners to new page
	this._suggestedSongButtons = goog.dom.query('.suggestedSongs a', this.contentDom);

	goog.array.forEach(this._suggestedSongButtons, function(suggestedSongButton) {
		this._contentEventHandler.listen(suggestedSongButton, 'click', this.onClickSuggestedSongButton, false, this);
	}, this);

	this._shareButtons = goog.dom.query('.share a', this.contentDom);

	goog.array.forEach(this._shareButtons, function(shareButton) {
		this._contentEventHandler.listen(shareButton, 'click', this.onClickShareButton, false, this);
	}, this);

	// tween it
	var songDetailContainer = goog.dom.getElementByClass('songDetailContainer', this.contentDom);
	var detailDoms = goog.dom.getChildren(songDetailContainer);

	this._contentAnimateInTweener = TweenMax.staggerFromTo(detailDoms, .5, {opacity: 0}, {opacity: 1}, .2, this.onAnimateInContent, null, this);
};


hlc.views.Sidebar.prototype.animateOutContent = function(){
	if(this._contentAnimateOutTweener) return;

	var songDetailContainer = goog.dom.getElementByClass('songDetailContainer', this.contentDom);
	if(!songDetailContainer) return;

	var detailDoms = goog.dom.getChildren(songDetailContainer);

	this._contentAnimateOutTweener = TweenMax.staggerTo(detailDoms, .5, {opacity: 0}, .2, this.onAnimateOutContent, null, this);
};


hlc.views.Sidebar.prototype.loadContent = function(albumId, songId){
	// cancel current loading
	goog.events.removeAll(this._request, "complete");
	this._request.abort();

	// nullify content html before loaded
	this._contentHtml = null;

	// animate out current content
	this.animateOutContent();

	// skip loading if content is already loaded
	if(this._contentDomElements[albumId]) {
		if(this._contentDomElements[albumId][songId]) {
			this.onLoaded(albumId, songId);
			return;
		}
	}

	// load new content
	var url = hlc.Url.INCLUDES + 'detail?album=' + albumId + '&song=' + songId;

	goog.events.listenOnce(this._request, "complete", function(e) {

		if(e.target.isSuccess()) {
			var responseText = e.target.getResponseText();
			//console.log(responseText);

			if(!this._contentDomElements[albumId]) this._contentDomElements[albumId] = [];
			if(!this._contentDomElements[albumId][songId]) this._contentDomElements[albumId][songId] = responseText;

			this.onLoaded(albumId, songId);
		}else {
			console.log(e.target.getLastError(), this);
		}

	}, false, this);

	this._request.send(url);
};


hlc.views.Sidebar.prototype.onClick = function(e) {
	switch(e.currentTarget) {
		case this.closeButtonDom:
		this.slideOut();
		break;
	}
};


hlc.views.Sidebar.prototype.onLoaded = function(albumId, songId) {
	this._contentHtml = this._contentDomElements[albumId][songId];
	
	var songDetailContainer = goog.dom.getElementByClass('songDetailContainer', this.contentDom);
	if(!songDetailContainer) this.animateInContent();
};


hlc.views.Sidebar.prototype.onAnimateInContent = function() {
	this._contentAnimateInTweener = null;

	// reset scroller
	this._scroller.reset();
};


hlc.views.Sidebar.prototype.onAnimateOutContent = function() {
	this._contentAnimateOutTweener = null;

	// remove previous page event listeners
	this._contentEventHandler.removeAll();

	this._suggestedSongButtons = [];
	this._shareButtons = [];

	// remove current content
	var songDetailContainer = goog.dom.getElementByClass('songDetailContainer', this.contentDom);
	goog.dom.removeNode(songDetailContainer);

	// reset scroller
	this._scroller.reset();
	
	// animate in next content if loaded
	if(this._contentHtml) this.animateInContent();
};


hlc.views.Sidebar.prototype.onClickSuggestedSongButton = function(e){
	e.preventDefault();

	var token = e.currentTarget.getAttribute('href');
	hlc.main.controllers.navigationController.setToken( token );
};


hlc.views.Sidebar.prototype.onClickShareButton = function(e){
	e.preventDefault();

	var url = e.currentTarget.getAttribute('href');
	var width = e.currentTarget.getAttribute('data-width');
	var height = e.currentTarget.getAttribute('data-height');
	hlc.utils.popUpWindow(url, width, height);
};


hlc.views.Sidebar.prototype.onMainScrollStart = function(e) {
	if(e.scrollPosition === hlc.controllers.MainScrollController.ScrollPosition.MASTHEAD
		&& this.isSlidedIn) {
		this.slideOut();
	}
};


hlc.views.Sidebar.prototype.onAlbumScrollFinish = function(e) {
	var song = e.albumSection.albumPlayer.getCurrentSong();
	var songId = song.songId;
	var albumId = song.album.albumId;

	this.loadContent(albumId, songId);
};


hlc.views.Sidebar.prototype.onSongChanged = function(e) {
	var songId = e.song.songId;
	var albumId = e.song.album.albumId;

	this.loadContent(albumId, songId);
};


hlc.views.Sidebar.prototype.onResize = function(e){
	if(this.isSlidedIn) this.slideIn();
};


hlc.views.Sidebar.EventType = {
	SLIDE_IN: 'slide_in',
	SLIDE_OUT: 'slide_out',
	SLIDED_IN: 'slided_in',
	SLIDED_OUT: 'slided_out'
};