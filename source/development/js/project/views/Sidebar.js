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
  this.isSlidedIn = false;

  this._size = goog.style.getSize(this.domElement);
  this._mainScrollerDomElement = goog.dom.getElement('main-scroller');

  this._contentDomElements = {
  	'albumId': {'songId': ''}
  };

  this._request = new goog.net.XhrIo();
};
goog.inherits(hlc.views.Sidebar, goog.events.EventTarget);


hlc.views.Sidebar.prototype.init = function(){
	hlc.main.controllers.windowController.addDispatcher(this);
	goog.events.listen(this, 'resize', this.onResize, false, this);
};


hlc.views.Sidebar.prototype.toggle = function(){
	if(this.isSlidedIn) this.slideOut();
	else this.slideIn();
};


hlc.views.Sidebar.prototype.slideIn = function(){
	this.isSlidedIn = true;

	var mainViewportWidth = hlc.main.controllers.windowController.getMainViewportSize().width;
	var targetMainScrollerWidth = mainViewportWidth - this._size.width;

	goog.style.setStyle(this._mainScrollerDomElement, 'width', targetMainScrollerWidth + 'px');
};


hlc.views.Sidebar.prototype.slideOut = function(){
	this.isSlidedIn = false;

	goog.style.setStyle(this._mainScrollerDomElement, 'width', '100%');
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


hlc.views.Sidebar.prototype.onLoaded = function(albumId, songId) {
	this.domElement.innerHTML = this._contentDomElements[albumId][songId];
};


hlc.views.Sidebar.prototype.onResize = function(e){
	if(this.isSlidedIn) this.slideIn();
};