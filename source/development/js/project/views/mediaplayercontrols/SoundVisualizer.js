goog.provide('hlc.views.mediaplayercontrols.SoundVisualizer');

goog.require('goog.events.EventTarget');
goog.require('goog.dom');

/**
 * @constructor
 */
hlc.views.mediaplayercontrols.SoundVisualizer = function(mediaPlayer, domElement){
  goog.base(this);

  this.mediaPlayer = mediaPlayer;
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

  for( var i = 0; i < shapeAmount; i ++ ) {
    var shapeHeight = audioData[Math.round(i * (audioData.length / shapeAmount))] / 4;
    var size = new paper.Size(shapeWidth, shapeHeight);
    var point = new paper.Point(i * shapeWidth, (this.canvas.height - shapeHeight) / 2);
    var shape = new paper.Path.Rectangle(point, size);

    shape.fillColor = {
      gradient: {
        stops: [new paper.Color(1, 1, 1, 0), new paper.Color(1, 1, 1, .2), new paper.Color(1, 1, 1, 0)]
      },
      origin: shape.bounds.topLeft,
      destination: shape.bounds.bottomLeft
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