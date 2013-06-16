goog.provide('hlc.views.MastheadNav');

goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.dom.query');

/**
 * @constructor
 */
hlc.views.MastheadNav = function(){
  goog.base(this);

  this.domElement = goog.dom.query('.masthead .nav')[0];
  this.buttons = goog.dom.query('.diamondButton', this.domElement);
  
  this._activeButton = null;

  goog.array.forEach(this.buttons, function(button) {
  	goog.events.listen(button, 'click', this.onClick, false, this);
  }, this);
};
goog.inherits(hlc.views.MastheadNav, goog.events.EventTarget);


hlc.views.MastheadNav.prototype.setActiveButton = function(button){
	if(this._activeButton) {
		goog.dom.classes.remove(this._activeButton, 'active');
	}

	this._activeButton = button;
	goog.dom.classes.add(this._activeButton, 'active');
};


hlc.views.MastheadNav.prototype.onClick = function(e){
	// set token
	var dataUrl = e.currentTarget.getAttribute('data-url');
	hlc.main.controllers.navigationController.setToken(dataUrl);
};