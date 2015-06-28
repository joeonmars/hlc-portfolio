goog.provide( 'hlc.views.mediaplayercontrols.SoundControl' );

goog.require( 'goog.events.EventTarget' );
goog.require( 'goog.events' );
goog.require( 'goog.dom' );
goog.require( 'goog.dom.query' );
goog.require( 'goog.dom.classes' );
goog.require( 'goog.fx.Dragger' );

/**
 * @constructor
 */
hlc.views.mediaplayercontrols.SoundControl = function( domElement ) {
  goog.base( this );

  this.domElement = domElement;

  this._soundButton = goog.dom.query( '.soundButton', this.domElement )[ 0 ];
  this._bar = goog.dom.query( '.bar', this.domElement )[ 0 ];
  this._handle = goog.dom.query( '.handle', this.domElement )[ 0 ];

  var dragRect = new goog.math.Rect( -1, -1, 109, 0 );
  this._dragger = new goog.fx.Dragger( this._handle, null, dragRect );

  this.volume = hlc.main.controllers.soundController.volume;

  goog.events.listen( this._soundButton, goog.events.EventType.CLICK, this.onClickSoundButton, false, this );
  goog.events.listen( this._dragger, goog.fx.Dragger.EventType.DRAG, this.onDrag, false, this );
  goog.events.listen( this, hlc.events.EventType.VOLUME, this.onVolumeChange, false, this );

  hlc.main.controllers.soundController.addDispatcher( this );

  this.onVolumeChange( {
    volume: this.volume,
    muted: hlc.main.controllers.soundController.isMuted()
  } );
};
goog.inherits( hlc.views.mediaplayercontrols.SoundControl, goog.events.EventTarget );


hlc.views.mediaplayercontrols.SoundControl.prototype.onDrag = function( e ) {
  var percent = e.dragger.deltaX / e.dragger.limits.width;
  percent = Math.max( Math.min( percent, 1 ), 0 );

  goog.style.setStyle( this._bar, 'width', percent * 100 + '%' );

  this.volume = percent;

  var soundController = hlc.main.controllers.soundController;

  if ( soundController.isMuted() ) {
    soundController.toggle();
  }

  soundController.setVolume( this.volume );
};


hlc.views.mediaplayercontrols.SoundControl.prototype.onClickSoundButton = function( e ) {

  var soundController = hlc.main.controllers.soundController;
  soundController.toggle();
};


hlc.views.mediaplayercontrols.SoundControl.prototype.onVolumeChange = function( e ) {

  var actualVol = e.volume * !e.muted;

  goog.style.setStyle( this._bar, 'width', actualVol * 100 + '%' );

  var handleX = ( this._dragger.limits.width - this._dragger.limits.left ) * actualVol + this._dragger.limits.left;
  goog.style.setPosition( this._handle, handleX, this._dragger.limits.top );

  goog.dom.classlist.enable( this._soundButton, 'mute', e.muted );
};