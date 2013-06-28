goog.provide('hlc.views.common.CircularProgressBar');

goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');

/**
 * @constructor
 */
hlc.views.common.CircularProgressBar = function(size){
  goog.base(this);

  var strokeWidth = 3;
  this._radius = size / 2 - strokeWidth / 2;

  this.domElement = goog.dom.createDom('canvas', {
  	'className': 'circularProgressBar',
  	'width': size,
  	'height': size
  });

  paper.setup(this.domElement);

	this._back = new paper.Path.Circle(paper.view.center, this._radius);
	this._back.strokeColor = 'grey';
	this._back.strokeWidth = strokeWidth;
	this._back.opacity = .5;

	this._progress = new paper.Path();
	this._progress.strokeColor = 'white';
	this._progress.strokeWidth = strokeWidth;
	this._progress.strokeCap = 'butt';
};
goog.inherits(hlc.views.common.CircularProgressBar, goog.events.EventTarget);


hlc.views.common.CircularProgressBar.prototype.setProgress = function(progress) {
	var center = paper.view.center;

	var start = new paper.Point({
		length: this._radius,
		angle: -90
	});

	var middle = start.rotate(360 * progress / 2);
	var end = start.rotate(360 * progress);

	// if a progress path was created before, remove its segments
	this._progress.removeSegments();

	this._progress.add(center.add(start));
	this._progress.arcTo(center.add(middle), center.add(end));
};