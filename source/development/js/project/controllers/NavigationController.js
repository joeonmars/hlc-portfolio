goog.provide('hlc.controllers.NavigationController');

goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.History');
goog.require('goog.history.Html5History');
goog.require('goog.history.EventType');
goog.require('goog.string');

/**
 * @constructor
 */
hlc.controllers.NavigationController = function(){
  goog.base(this);

  // a toggle of whether to use history API
  this._useHistoryAPI = null;

  // the current token
  this._token = null;

  // the history object
  this._navHistory = null;
};
goog.inherits(hlc.controllers.NavigationController, goog.events.EventTarget);
goog.addSingletonGetter(hlc.controllers.NavigationController);


hlc.controllers.NavigationController.prototype.init = function(){
  this._useHistoryAPI = (hlc.controllers.NavigationController.Implementation === hlc.controllers.NavigationController.HISTORY_API);

  if(this._useHistoryAPI) {
  	this._navHistory = new goog.history.Html5History();
  	this._navHistory.setUseFragment(false);
  }else {
  	var input = goog.dom.createDom('input');
  	var iframe = goog.dom.createDom('iframe');
  	this._navHistory = new goog.History(false, null, input, iframe);
  }

  // the current token
  this._token = null;

  goog.events.listen(this._navHistory, goog.history.EventType.NAVIGATE, this.onNavigate, false, this);

  this._navHistory.setEnabled(true);
};


hlc.controllers.NavigationController.prototype.setToken = function(token, title){
	// if using hash, make sure the '/' is prepended
	if(!this._useHistoryAPI) {
		if(!goog.string.startsWith(token, '/')) {
			token = ('/').concat(token);
		}
	}

	this._navHistory.setToken(token ,title);
};


hlc.controllers.NavigationController.prototype.getToken = function(){
	var token = this._navHistory.getToken();
	if(goog.string.startsWith(token, '/')) {
		token = token.substring(1);
	}
	return token;
};


hlc.controllers.NavigationController.prototype.replaceToken = function(token, title){
	this._navHistory.replaceToken(token ,title);
};


hlc.controllers.NavigationController.prototype.handleToken = function(token){
	console.log('handle token: ' + token);
};


hlc.controllers.NavigationController.prototype.onNavigate = function(e){
	// validate the token by HTML5 history API support,
	// optionally append or remove hash fragment,
	// and reset the window location
	var tokenStr = goog.string.remove(window.location.href, hlc.Url.ORIGIN);

	if(e.token === '' && tokenStr !== '') {
		if(this._useHistoryAPI) {
			// indicates a possible hash bang to be removed
			if(goog.string.startsWith(tokenStr, '#/')) {
				var token = tokenStr.substring(2);
				window.location = hlc.Url.ORIGIN + token;
			}
		}else{
			// indicates a possible lack of hash bang
			if(!goog.string.startsWith(tokenStr, '#/')) {
				var token = ('#/').concat(tokenStr);
				window.location = hlc.Url.ORIGIN + token;
			}
		}

		return false;
	}

	// skip duplicated token returned by the closure html5History API
	if(this._token === e.token) return false;
	else this._token = e.token;

	this.handleToken( this.getToken() );
};


hlc.controllers.NavigationController.HASH = 'hash';
hlc.controllers.NavigationController.HISTORY_API = 'history_api';
hlc.controllers.NavigationController.Implementation = (goog.history.Html5History.isSupported() ? hlc.controllers.NavigationController.HISTORY_API : hlc.controllers.NavigationController.HASH);