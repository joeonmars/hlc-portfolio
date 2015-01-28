goog.provide('hlc.views.mastheadpages.Portrait');

goog.require('goog.events.EventTarget');
goog.require('goog.events');

/**
 * @constructor
 */
hlc.views.mastheadpages.Portrait = function(){

  goog.base(this);

  this._eventHandler = new goog.events.EventHandler(this);

	this._currentFrame = 0;
	this._totalFrames = 60;
	
	this._windowWidth = 0;
	this._boundLeft = 0;
	this._boundRight = 0;

	this._progress = 0;

	this._tweener = new TweenMax(this, 2, {
		_progress: this._progress,
		'paused': true,
		'ease': Cubic.easeOut,
		'onUpdate': this.updateProgress,
		'onUpdateScope': this,
		'onComplete': this.onProgressComplete,
		'onCompleteScope': this
	});

	this._img = goog.dom.query('#home .portrait')[0];

	this._imgLoader = new goog.net.ImageLoader();

	this._lowResSrcs = [];
	this._highResSrcs = [];

	for(var i = 0; i < this._totalFrames; i++) {
		this._lowResSrcs.push( hlc.main.assets['portrait-lowres-'+i].src );
	}
};
goog.inherits(hlc.views.mastheadpages.Portrait, goog.events.EventTarget);


hlc.views.mastheadpages.Portrait.prototype.activate = function(){

	this._eventHandler.listen( document, goog.events.EventType.MOUSEMOVE, this.onMouseMove, false, this );
	this._eventHandler.listen( window, goog.events.EventType.RESIZE, this.resize, false, this );
	this._eventHandler.listen(this._imgLoader, goog.events.EventType.LOAD, this.onHighResImageLoad, false, this);

	this.resize();
};


hlc.views.mastheadpages.Portrait.prototype.deactivate = function(){

	this._eventHandler.removeAll();
};


hlc.views.mastheadpages.Portrait.prototype.gotoFrame = function( frame ){

	this._currentFrame = frame;

	this._img.src = this._highResSrcs[frame] || this._lowResSrcs[frame];
};


hlc.views.mastheadpages.Portrait.prototype.updateProgress = function(){

	var frame = Math.round( (this._totalFrames - 1) * (1-this._progress) );
	this.gotoFrame( frame );
};


hlc.views.mastheadpages.Portrait.prototype.resize = function(){

	this._windowWidth = goog.dom.getViewportSize().width;
	this._boundLeft = Math.max(0, goog.style.getPageOffsetLeft(this._img));
	this._boundRight = this._windowWidth - this._boundLeft;
};


hlc.views.mastheadpages.Portrait.prototype.onMouseMove = function( e ){

	var mouseXFraction = (e.clientX - this._boundLeft) / (this._boundRight - this._boundLeft);
	mouseXFraction = goog.math.clamp(mouseXFraction, 0, 1);

	this._tweener.play();

	this._tweener.updateTo({
		_progress: mouseXFraction
	}, true);
};


hlc.views.mastheadpages.Portrait.prototype.onProgressComplete = function(){

	var hasLoadedHighRes = this._highResSrcs[ this._currentFrame ];

	if(!hasLoadedHighRes) {

		var src = hlc.Url.STATIC_IMAGES + 'portrait/highres/' + goog.string.padNumber(this._currentFrame, 2) + '.png';
		this._imgLoader.addImage( this._currentFrame, src );
		this._imgLoader.start();
	}
};


hlc.views.mastheadpages.Portrait.prototype.onHighResImageLoad = function(e){

	this._highResSrcs[e.target.id] = e.target.src;

	this._imgLoader.removeImage( e.target.id );

	if(this._currentFrame === parseInt(e.target.id)) {
		
		this.gotoFrame( this._currentFrame );
	}
};