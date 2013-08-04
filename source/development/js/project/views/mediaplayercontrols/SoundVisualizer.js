goog.provide('hlc.views.mediaplayercontrols.SoundVisualizer');

goog.require('goog.events.EventTarget');
goog.require('goog.dom');
goog.require('goog.color');

/**
 * @constructor
 */
hlc.views.mediaplayercontrols.SoundVisualizer = function(domElement){
  goog.base(this);

  this.canvas = domElement;

  this.audioData = null;

  paper = new paper.PaperScope();
  paper.setup(this.canvas);

  this.shapeGroup = new paper.Group();
  this.view = paper.view;

  this.actualCanvasSize = goog.style.getSize(this.canvas);
  this.progress = 0;
  this.updateProgress(this.progress);
};
goog.inherits(hlc.views.mediaplayercontrols.SoundVisualizer, goog.events.EventTarget);


hlc.views.mediaplayercontrols.SoundVisualizer.prototype.draw = function(audioData) {
  if(this.audioData === audioData) return;
  else this.audioData = audioData;

  this.shapeGroup.removeChildren();

  if(audioData.length === 0) {
    this.view.draw();
    return;
  }

  // create shapes
  var shapes = [];
  var shapeAmount = Math.round( this.canvas.width / 2 );
  var shapeWidth = this.canvas.width / shapeAmount;

  var purpleInRgb = goog.color.hexToRgb('#535362');
  var gradients = goog.array.repeat(purpleInRgb, shapeAmount);
  var halfAmount = shapeAmount / 2;
  gradients = goog.array.map(gradients, function(color, index) {
    var lighten = (index <= halfAmount) ? (index / halfAmount) : (1 - (index - halfAmount) / halfAmount);
    return goog.color.lighten(color, lighten);
  });

  for( var i = 0; i < shapeAmount; i ++ ) {
    var shapeHeight = audioData[Math.round(i * (audioData.length / shapeAmount))] / 4;
    var size = new paper.Size(shapeWidth, shapeHeight);
    var point = new paper.Point(i * shapeWidth, (this.canvas.height - shapeHeight) / 2);
    var shape = new paper.Path.Rectangle(point, size);

    var gradientColor = gradients[i];
    var r = gradientColor[0] / 225;
    var g = gradientColor[1] / 225;
    var b = gradientColor[2] / 225;
    var topColor = new paper.Color(r, g, b, 0);
    var midColor = new paper.Color(r, g, b, .2);
    var bottomColor = new paper.Color(r, g, b, 0);

    shape.fillColor = {
      'gradient': {
        'stops': [topColor, midColor, bottomColor]
      },
      'origin': shape.bounds.topLeft,
      'destination': shape.bounds.bottomLeft
    };

    shapes[i] = shape;
  }

  this.shapeGroup.addChildren( shapes );

  this.view.draw();
};


hlc.views.mediaplayercontrols.SoundVisualizer.prototype.updateProgress = function(progress) {
  this.progress = progress;

  var top = 0;
  var right = this.actualCanvasSize.width * this.progress;
  var bottom = this.actualCanvasSize.height;
  var left = 0;

  goog.style.setStyle(this.canvas, 'clip', 'rect(' + top + 'px,' + right + 'px,' + bottom + 'px,' + left + 'px)');
};


hlc.views.mediaplayercontrols.SoundVisualizer.prototype.onResize = function(e) {
  this.actualCanvasSize = goog.style.getSize(this.canvas);
  this.updateProgress(this.progress);
};