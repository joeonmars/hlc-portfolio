goog.provide('hlc.fx.Heading');

goog.require('goog.dom');


/**
 * @constructor
 */
hlc.fx.Heading = function(domElement){
  
  goog.base(this);

  this.domElement = hlc.fx.Heading.constructDom( domElement );
  this._topLine = goog.dom.query('.top', this.domElement)[0];
  this._bottomLine = goog.dom.query('.bottom', this.domElement)[0];
  this._topFill = goog.dom.query('.fill', this._topLine)[0];
  this._bottomFill = goog.dom.query('.fill', this._bottomLine)[0];

  this._progress = 0;
};
goog.inherits(hlc.fx.Heading, goog.events.EventTarget);


hlc.fx.Heading.prototype.animateIn = function( shouldAnimateProgress ) {

  goog.dom.classlist.enable(this.domElement, 'animate-in', true);

  if(shouldAnimateProgress && this._progress === 0) {

    TweenMax.fromTo(this, 2, {
      _progress: 0
    }, {
      _progress: 1,
      'onUpdate': function() {
        this.setProgress( this._progress );
      },
      'onUpdateScope': this
    });
  }
};


hlc.fx.Heading.prototype.reset = function() {

  this._progress = 0;
  goog.dom.classlist.enable(this.domElement, 'loading', true);
  goog.dom.classlist.enable(this.domElement, 'animate-in', false);
};


hlc.fx.Heading.prototype.setProgress = function(progress) {

  this._progress = progress;

  var opacity = goog.math.lerp(.5, 1, progress);
  var perc = progress * 100 + '%';

  goog.style.setStyle( this._topLine, 'opacity', opacity );
  goog.style.setStyle( this._bottomLine, 'opacity', opacity );

  goog.style.setStyle( this._topFill, 'width', perc );
  goog.style.setStyle( this._bottomFill, 'width', perc );

  goog.dom.classlist.enable(this.domElement, 'loading', !(progress === 1));
};


hlc.fx.Heading.constructDom = function(domElement){

  var text = goog.dom.getTextContent(domElement);
  goog.dom.setTextContent(domElement, '');

  var charas = text.split('');

  var charaHtmlStr = '<div class="line top"><div class="fill"></div></div><div>';

  goog.array.forEach(charas, function(chara) {
    charaHtmlStr += '<span>' + chara + '</span>';
  });

  charaHtmlStr += '</div><div class="line bottom"><div class="fill"></div></div>';

  var frag = goog.dom.htmlToDocumentFragment(charaHtmlStr);

  goog.dom.appendChild(domElement, frag);

  return domElement;
};