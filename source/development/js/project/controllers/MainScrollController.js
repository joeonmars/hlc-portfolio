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

	hlc.main.controllers.navigationController.addDispatcher(this);
	goog.events.listen(this, goog.history.EventType.NAVIGATE, this.onNavigate, false, this);
};


hlc.controllers.MainScrollController.prototype.scrollTo = function(scrollPosition){
	var y;
	if( scrollPosition === hlc.controllers.MainScrollController.ScrollPosition.MASTHEAD ) {
		y = 0;
	}else if( scrollPosition === hlc.controllers.MainScrollController.ScrollPosition.ALBUM ) {
		y = 'max';
	}

	this.scrollPosition = scrollPosition;

	if(this._tweener) this._tweener.kill();

	this._tweener = TweenMax.to(this._mainScrollDomElement, .8, {
		scrollTo: {y: y},
		ease: Power2.easeOut,
		onStart: function() {
			var ev = {
				type: hlc.events.EventType.SCROLL_START,
				scrollPosition: this.scrollPosition
			};
			this.dispatchEvent(ev);
		},
		onStartScope: this,
		onUpdate: function() {
			var ev = {
				type: hlc.events.EventType.SCROLL_UPDATE,
				scrollPosition: this.scrollPosition,
				progress: this._tweener.progress()
			};
			this.dispatchEvent(ev);
		},
		onUpdateScope: this,
		onComplete: function() {
			var ev = {
				type: hlc.events.EventType.SCROLL_COMPLETE,
				scrollPosition: this.scrollPosition
			};
			this.dispatchEvent(ev);
		},
		onCompleteScope: this
	});
};


hlc.controllers.MainScrollController.prototype.onNavigate = function(e){
	if(this.scrollPosition === hlc.controllers.MainScrollController.ScrollPosition.ALBUM) {
		if(!goog.string.startsWith(e.token, 'album')) this.scrollTo(hlc.controllers.MainScrollController.ScrollPosition.MASTHEAD);
	}else if(this.scrollPosition === hlc.controllers.MainScrollController.ScrollPosition.MASTHEAD) {
		if(goog.string.startsWith(e.token, 'album')) this.scrollTo(hlc.controllers.MainScrollController.ScrollPosition.ALBUM);
	}
};


hlc.controllers.MainScrollController.prototype.onResize = function(e){
	this.scrollTo(this.scrollPosition);
};


hlc.controllers.MainScrollController.ScrollPosition = {
	MASTHEAD: 'masthead',
	ALBUM: 'album'
};