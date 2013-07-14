goog.provide('hlc.views.Sidebar');

goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.net.XhrIo');

/**
 * @constructor
 */
hlc.views.Sidebar = function(){
  goog.base(this);

  this.domElement = goog.dom.getElement('sidebar');
  this.contentDom = goog.dom.getElementByClass('content', this.domElement);
  this.closeButtonDom = goog.dom.getElementByClass('closeButton', this.domElement);

  this.isSlidedIn = false;

  this._size = goog.style.getSize(this.domElement);
  this._mainScrollerDomElement = goog.dom.getElement('main-scroller');

  this._contentDomElements = {
  	'albumId': {'songId': ''}
  };

  this._slideTweener = null;

  this._request = new goog.net.XhrIo();
};
goog.inherits(hlc.views.Sidebar, goog.events.EventTarget);


hlc.views.Sidebar.prototype.init = function(){
	hlc.main.controllers.windowController.addDispatcher(this);
	goog.events.listen(this, 'resize', this.onResize, false, this);

	// listen for click event
	goog.events.listen(this.closeButtonDom, 'click', this.onClick, false, this);

	// listen for album scroll event
	goog.events.listen(hlc.main.controllers.albumScrollController,
		hlc.controllers.AlbumScrollController.EventType.SCROLL_FINISH,
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
			hlc.main.views.mainHud.mediaPlayer.onResize();
		},
		'onComplete': function() {
			this.dispatchEvent({type: hlc.views.Sidebar.EventType.SLIDED_IN})
		},
		'onCompleteScope': this
	});

	goog.dom.classes.remove(this.closeButtonDom, 'hide');
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
			hlc.main.views.mainHud.mediaPlayer.onResize();
		},
		'onComplete': function() {
			this.dispatchEvent({type: hlc.views.Sidebar.EventType.SLIDED_OUT})
		},
		'onCompleteScope': this
	});

	goog.dom.classes.add(this.closeButtonDom, 'hide');
};


hlc.views.Sidebar.prototype.loadContent = function(albumId, songId){
	// cancel current loading
	goog.events.removeAll(this._request, "complete");
	this._request.abort();

	// skip loading if content is already loaded
	if(this._contentDomElements[albumId]) {
		if(this._contentDomElements[albumId][songId]) {
			this.onLoaded(albumId, songId);
			return;
		}
	}

	// load new content
	var url = hlc.Url.ORIGIN + 'detail?album=' + albumId + '&song=' + songId;

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
	this.contentDom.innerHTML = this._contentDomElements[albumId][songId];
};


hlc.views.Sidebar.prototype.onAlbumScrollFinish = function(e) {
	var song = e.albumSection.albumPlayer.getCurrentSong();
	var songId = song.songId;
	var albumId = song.albumId;

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