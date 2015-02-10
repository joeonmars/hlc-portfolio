goog.provide('hlc.views.Credits');

goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.dom.classes');
goog.require('hlc.events');

/**
 * @constructor
 */
hlc.views.Credits = function(){
  
  goog.base(this);

  this.domElement = goog.dom.getElement('credits');

  this._headerEl = goog.dom.query('header', this.domElement)[0];
  this._topHeaderLineEl = goog.dom.query('.top', this._headerEl)[0];
  this._bottomHeaderLineEl = goog.dom.query('.bottom', this._headerEl)[0];
  this._portraitEl = goog.dom.getElementByClass('portrait', this.domElement);
  this._memberEls = goog.dom.query('.members li', this.domElement);
  this._dividerEl = goog.dom.query('.divider', this.domElement)[0];
  this._copyrightEl = goog.dom.getElementByClass('copyright', this.domElement);
  this._closeButton = goog.dom.getElementByClass('close', this.domElement);

  this._tweener = TweenMax.set(this.domElement, {
    autoAlpha: 0
  });
};
goog.inherits(hlc.views.Credits, goog.events.EventTarget);


hlc.views.Credits.prototype.open = function(){

  if(this._tweener.isActive()) return;

  TweenMax.fromTo(this.domElement, .45, {
    autoAlpha: 0
  },{
    autoAlpha: 1,
    ease: Cubic.easeOut,
    onComplete: this.onOpened,
    onCompleteScope: this
  });

  TweenMax.fromTo(this._portraitEl, 2, {
    opacity: 1,
    scale: 1.05
  }, {
    opacity: .9,
    scale: 1,
    ease: Cubic.easeOut
  });

  TweenMax.fromTo(this._headerEl, 1, {
    opacity: 0
  }, {
    delay: .45,
    opacity: 1,
    ease: Cubic.easeInOut
  });

  TweenMax.fromTo(this._topHeaderLineEl, .65, {
    width: '0%',
    opacity: 0
  }, {
    delay: .45,
    width: '100%',
    opacity: 1,
    ease: Sine.easeInOut
  });

  TweenMax.fromTo(this._bottomHeaderLineEl, .65, {
    width: '0%',
    opacity: 0
  }, {
    delay: .55,
    width: '100%',
    opacity: 1,
    ease: Sine.easeInOut
  });

  goog.array.forEach(this._memberEls, function(memberEl, index) {
    TweenMax.fromTo(memberEl, 1, {
      opacity: 0,
      y: 8
    },{
      delay: index * 0.08 + 1,
      opacity: 1,
      y: 0,
      ease: Cubic.easeOut
    });
  });

  TweenMax.fromTo(this._dividerEl, .65, {
    width: '0%',
    opacity: 0
  }, {
    delay: 1.1,
    width: '100%',
    opacity: 1,
    ease: Sine.easeInOut
  });

  TweenMax.fromTo(this._copyrightEl, .85, {
    opacity: 0,
    y: 10
  }, {
    delay: 1.5,
    opacity: 1,
    y: 0,
    ease: Cubic.easeOut
  });

  this.dispatchEvent( hlc.events.EventType.ANIMATE_IN_START );

  return true;
};


hlc.views.Credits.prototype.close = function(){

  if(this._tweener.isActive()) return;

  TweenMax.to(this.domElement, .45, {
    autoAlpha: 0,
    ease: Cubic.easeOut,
    onComplete: this.onClosed,
    onCompleteScope: this
  });

  this.dispatchEvent( hlc.events.EventType.ANIMATE_OUT_START );

  return true;
};


hlc.views.Credits.prototype.onOpened = function(){

  goog.events.listenOnce( this._closeButton, goog.events.EventType.CLICK, this.close, false, this );

  this.dispatchEvent( hlc.events.EventType.ANIMATE_IN_COMPLETE );
};


hlc.views.Credits.prototype.onClosed = function(){

  goog.events.unlisten( this._closeButton, goog.events.EventType.CLICK, this.close, false, this );

  this.dispatchEvent( hlc.events.EventType.ANIMATE_OUT_COMPLETE );
};