goog.provide('hlc.views.MastheadNav');

goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('hlc.views.DiamondButtonTracker');

/**
 * @constructor
 */
hlc.views.MastheadNav = function(){
  goog.base(this);

  this.domElement = goog.dom.query('.masthead .nav')[0];
  this.buttons = goog.dom.query('.diamondButton', this.domElement);
  
  this._activeButton = null;

  var tracker = hlc.views.DiamondButtonTracker.getInstance();

  goog.array.forEach(this.buttons, function(button) {
  	tracker.add(button, null, new goog.math.Size(100, 100));
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


hlc.views.MastheadNav.prototype.setBlack = function(toggle){
	goog.array.forEach(this.buttons, function(button) {
		if(toggle === true) goog.dom.classes.add(button, 'black');
		else goog.dom.classes.remove(button, 'black');
	});
};


hlc.views.MastheadNav.prototype.onClick = function(e){
	e.preventDefault();

	var tracker = hlc.views.DiamondButtonTracker.getInstance();
	var hasClickedOnShape = tracker.getClickResult(e, true);
	if(!hasClickedOnShape) return false;

	// set token
	var token = e.currentTarget.getAttribute('href');
	hlc.main.controllers.navigationController.setToken(token);
};