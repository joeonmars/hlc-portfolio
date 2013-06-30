goog.provide('hlc.views.common.CircularProgressBar');

goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');

/**
 * @constructor
 */
hlc.views.common.CircularProgressBar = function(size){
  goog.base(this);

  var strokeWidth = 2;
  this._radius = size / 2 - strokeWidth / 2;

  this._progress = 0;

  this.domElement = goog.dom.createDom('canvas', {
  	'className': 'circularProgressBar',
  	'width': size,
  	'height': size
  });

  paper.setup(this.domElement);

	this._backPath = new paper.Path.Circle(paper.view.center, this._radius);
	this._backPath.strokeColor = 'white';
	this._backPath.strokeWidth = strokeWidth;
	this._backPath.opacity = .2;

	this._progressPath = new paper.Path();
	this._progressPath.strokeColor = 'white';
	this._progressPath.strokeWidth = strokeWidth;
	this._progressPath.strokeCap = 'butt';
};
goog.inherits(hlc.views.common.CircularProgressBar, goog.events.EventTarget);


hlc.views.common.CircularProgressBar.prototype.setProgress = function(progress) {
	if(this._progress === progress) return;
	else this._progress = progress;

	var center = paper.view.center;

	var start = new paper.Point({
		length: this._radius,
		angle: -90
	});

	var middle = start.rotate(360 * this._progress / 2);
	var end = start.rotate(360 * this._progress);

	// if a progress path was created before, remove its segments
	this._progressPath.removeSegments();

	this._progressPath.add(center.add(start));
	this._progressPath.arcTo(center.add(middle), center.add(end));
};