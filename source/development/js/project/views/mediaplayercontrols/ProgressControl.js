goog.provide( 'hlc.views.mediaplayercontrols.ProgressControl' );

goog.require( 'goog.events.EventTarget' );
goog.require( 'goog.events' );
goog.require( 'goog.dom' );
goog.require( 'goog.dom.query' );
goog.require( 'goog.dom.classes' );
goog.require( 'goog.fx.Dragger' );

/**
 * @constructor
 */
hlc.views.mediaplayercontrols.ProgressControl = function( domElement ) {
  goog.base( this );

  this.domElement = domElement;
  this.playheadDom = goog.dom.getElementByClass( 'playhead', this.domElement );
  this.columnDom = goog.dom.getElementByClass( "fullColumn", this.domElement );

  this._progressBarLeft = null;

  this._isPausedBeforeDrag = false;

  var dragRect = new goog.math.Rect( 0, 0, 0, 0 );
  this._dragger = new goog.fx.Dragger( this.columnDom, null, dragRect );
  this._dragger.defaultAction = function() {};

  goog.events.listen( this._dragger, goog.fx.Dragger.EventType.START, this.onDragStart, false, this );
  goog.events.listen( this._dragger, goog.fx.Dragger.EventType.END, this.onDragEnd, false, this );
  goog.events.listen( this._dragger, goog.fx.Dragger.EventType.DRAG, this.onDrag, false, this );
};
goog.inherits( hlc.views.mediaplayercontrols.ProgressControl, goog.events.EventTarget );


hlc.views.mediaplayercontrols.ProgressControl.prototype.updateProgress = function( progress ) {
  goog.style.setStyle( this.playheadDom, 'width', progress * 100 + '%' );
};


hlc.views.mediaplayercontrols.ProgressControl.prototype.onDragStart = function( e ) {
  // pause the sound when drag start
  this._isPausedBeforeDrag = hlc.main.controllers.soundController.isPaused();
  hlc.main.controllers.soundController.pause();
};


hlc.views.mediaplayercontrols.ProgressControl.prototype.onDragEnd = function( e ) {
  // resume the sound if was playing
  if ( !this._isPausedBeforeDrag ) hlc.main.controllers.soundController.play();
};


hlc.views.mediaplayercontrols.ProgressControl.prototype.onDrag = function( e ) {
  var progress = ( e.dragger.clientX - this._progressBarLeft ) / e.dragger.limits.width;
  progress = Math.max( Math.min( progress, .999 ), 0 );

  hlc.main.controllers.soundController.setProgress( progress );
};


hlc.views.mediaplayercontrols.ProgressControl.prototype.onResize = function( e ) {
  this._dragger.limits.width = goog.style.getSize( this.columnDom ).width;
  this._dragger.setLimits( this._dragger.limits );

  this._progressBarLeft = goog.style.getPageOffsetLeft( this.columnDom );
};