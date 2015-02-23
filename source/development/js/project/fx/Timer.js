goog.provide('hlc.fx.Timer');


/**
 * @constructor
 */
hlc.fx.Timer = function(callback, delay, callbackScope){
  
  goog.base(this);

  this._callback = callback;
  this._callbackScope = callbackScope;

  this._delay = delay;

  this._timerId = null;

  this._start = goog.now();
  this._remaining = this._delay;

  this._tick = goog.bind(this.tick, this);
};
goog.inherits(hlc.fx.Timer, goog.events.EventTarget);


hlc.fx.Timer.prototype.pause = function(){

  if(this._timerId === null) return;

  window.clearTimeout( this._timerId );
  this._timerId = null;

  this._remaining -= (goog.now() - this._start);
};


hlc.fx.Timer.prototype.stop = function(){

  if(this._timerId === null) return;

  window.clearTimeout( this._timerId );
  this._timerId = null;
  
  this._remaining = this._delay;
};


hlc.fx.Timer.prototype.start = function( restart ){

  if(restart) {

    this.stop();

  }else if(goog.isNumber(this._timerId)) {

    return;
  }

  this._start = goog.now();

  this._timerId = window.setTimeout( this._tick, this._remaining, goog.getUid(this) );
};


hlc.fx.Timer.prototype.tick = function() {

  this._remaining = this._delay;

  this._callback.call( this._callbackScope );

  this.dispatchEvent( goog.Timer.TICK );
};