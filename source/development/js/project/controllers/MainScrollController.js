goog.provide('hlc.controllers.MainScrollController');

goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom.query');

/**
 * @constructor
 */
hlc.controllers.MainScrollController = function(){
  goog.base(this);

  this._tweener = null;
  this._mainScrollDomElement = goog.dom.query('#main-scroller > .viewport')[0];

  this.scrollPosition = hlc.controllers.MainScrollController.ScrollPosition.MASTHEAD;
};
goog.inherits(hlc.controllers.MainScrollController, goog.events.EventTarget);
goog.addSingletonGetter(hlc.controllers.MainScrollController);


hlc.controllers.MainScrollController.prototype.init = function(){
  hlc.main.controllers.windowController.addDispatcher(this);
	goog.events.listen(this, 'resize', this.onResize, false, this);
};


hlc.controllers.MainScrollController.prototype.scrollTo = function(scrollPosition){
	var y;
	if( scrollPosition === hlc.controllers.MainScrollController.ScrollPosition.MASTHEAD ) {
		y = 0;
	}else if( scrollPosition === hlc.controllers.MainScrollController.ScrollPosition.ALBUM ) {
		y = 'max';
	}

	this.scrollPosition = scrollPosition;

	this._tweener = TweenMax.to(this._mainScrollDomElement, .8, {
		scrollTo: {y: y},
		ease: Power2.easeOut,
		onComplete: function() {
			var ev = {
				type: hlc.controllers.MainScrollController.EventType.SCROLL_FINISH,
				scrollPosition: this.scrollPosition
			};
			this.dispatchEvent(ev);
		},
		onCompleteScope: this
	});
};


hlc.controllers.MainScrollController.prototype.onResize = function(e){
	this.scrollTo(this.scrollPosition);
};


hlc.controllers.MainScrollController.EventType = {
	SCROLL_FINISH: 'scroll_finish'
};

hlc.controllers.MainScrollController.ScrollPosition = {
	MASTHEAD: 'masthead',
	ALBUM: 'album'
};