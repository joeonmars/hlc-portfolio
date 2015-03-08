goog.provide('hlc.views.mastheadpages.BiographyNavigation');

goog.require('goog.events.EventTarget');
goog.require('goog.events.EventHandler');


/**
 * @constructor
 */
hlc.views.mastheadpages.BiographyNavigation = function(domElement){

  goog.base(this);
  
  this.domElement = domElement;
  this._buttons = goog.dom.query('button', this.domElement);
  this._activeButton = null;

  this._eventHandler = new goog.events.EventHandler(this);
};
goog.inherits(hlc.views.mastheadpages.BiographyNavigation, goog.events.EventTarget);


hlc.views.mastheadpages.BiographyNavigation.prototype.activate = function() {

  goog.array.forEach(this._buttons, function(button) {
    this._eventHandler.listen( button, goog.events.EventType.CLICK, this.onClickButton, false, this );
  }, this);
};


hlc.views.mastheadpages.BiographyNavigation.prototype.deactivate = function() {

  this._eventHandler.removeAll();
};


hlc.views.mastheadpages.BiographyNavigation.prototype.setActiveButton = function( button ) {

  if(this._activeButton) {
    this._activeButton.disabled = false;
  }

  this._activeButton = button;
  this._activeButton.disabled = true;
};


hlc.views.mastheadpages.BiographyNavigation.prototype.onClickButton = function(e) {

  this.setActiveButton( e.currentTarget );

  this.dispatchEvent({
    type: e.type,
    id: e.currentTarget.getAttribute('data-id')
  });
};