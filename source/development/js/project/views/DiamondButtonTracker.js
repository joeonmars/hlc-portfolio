goog.provide('hlc.views.DiamondButtonTracker');

goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.style');
goog.require('goog.math.Coordinate');
goog.require('goog.testing.events');

/**
 * @constructor
 */
hlc.views.DiamondButtonTracker = function(){
  goog.base(this);

  this._trackers = {};
};
goog.inherits(hlc.views.DiamondButtonTracker, goog.events.EventTarget);
goog.addSingletonGetter(hlc.views.DiamondButtonTracker);


hlc.views.DiamondButtonTracker.prototype.add = function(button, facing, size){
  // create a canvas for click detection
  var canvas = goog.dom.createDom('canvas');
  var size = size || goog.style.getSize(button);
  canvas.width = size.width;
  canvas.height = size.height;

  var ctx = canvas.getContext('2d');
  ctx.beginPath();

  // determine to draw a diamond or triangle
  if(size.width === size.height) {
    // diamond
    ctx.moveTo(0, size.height/2);
    ctx.lineTo(size.width/2, 0);
    ctx.lineTo(size.width, size.height/2);
    ctx.lineTo(size.width/2, size.height);
  }else {
    // triangle
    switch(facing) {
      default:
      case 'down':
      ctx.moveTo(0, 0);
      ctx.lineTo(size.width, 0);
      ctx.lineTo(size.width/2, size.height);
      break;

      case 'up':
      ctx.moveTo(0, size.height);
      ctx.lineTo(size.width/2, 0);
      ctx.lineTo(size.width, size.height);
      break;

      case 'left':
      ctx.moveTo(0, size.height/2);
      ctx.lineTo(size.width, 0);
      ctx.lineTo(size.width, size.height);
      break;

      case 'right':
      ctx.moveTo(0, 0);
      ctx.lineTo(size.width, size.height/2);
      ctx.lineTo(0, size.height);
      break;
    }
  }
  
  ctx.closePath();
  ctx.fill();

  // add to trackers
  var buttonUid = goog.getUid(button);

  var tracker = {
    canvas: canvas,
    button: button
  };

  this._trackers[buttonUid] = tracker;

  return tracker;
};


hlc.views.DiamondButtonTracker.prototype.isTransparentPixel = function(canvas, x, y){

};


hlc.views.DiamondButtonTracker.prototype.isButtonClicked = function(button, x, y){
  var buttonPos = goog.style.getPageOffset(button);
  var clickedX = x - buttonPos.x;
  var clickedY = y - buttonPos.y;

  var canvas = this._trackers[goog.getUid(button)].canvas;
  var ctx = canvas.getContext('2d');
  var data = ctx.getImageData(clickedX, clickedY, 1, 1).data;
  
  return data[3] > 0;
};


hlc.views.DiamondButtonTracker.prototype.getClickResult = function(e, onlyThis){
  var button = e.currentTarget;
  var result = this.isButtonClicked(button, e.clientX, e.clientY);

  if(result === true) {

    return true;

  }else if(onlyThis != true) {

    goog.object.forEach(this._trackers, function(obj) {
      if(obj.button !== button) {
        if(this.isButtonClicked(obj.button, e.clientX, e.clientY) === true) {
          goog.testing.events.fireClickEvent(obj.button, null, new goog.math.Coordinate(e.clientX, e.clientY));
          return false;
        }
      }
    }, this);

  }

  return false;
};