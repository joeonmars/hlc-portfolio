goog.provide( 'hlc.views.Preloader' );

goog.require( 'goog.async.Throttle' );
goog.require( 'goog.dom' );
goog.require( 'goog.events.EventTarget' );
goog.require( 'hlc.views.Loader' );


/** @constructor */
hlc.views.Preloader = function() {

	var bulkAssets = {
		'sitemap': hlc.Url.ORIGIN + 'sitemap.html'
	};
	
	var imageAssets = {};

	goog.object.forEach(hlc.main.data.preloadAssets, function(url, id) {
		goog.object.add(imageAssets, id, url);
	});

	goog.base(this, bulkAssets, imageAssets, 4000);

	this.assets = {};
	this._domElement = goog.dom.getElement('preloader');

	this._innerEl = goog.dom.getElementByClass('inner', this._domElement);
	this._curtainEl = goog.dom.getElementByClass('curtain', this._domElement);

	this._contentEl = goog.dom.getElementByClass('content', this._domElement);

	this._portraitEl = goog.dom.getElementByClass('portrait', this._domElement);

	this._hintEl = goog.dom.getElementByClass('hint', this._domElement);

	this._slashEl = goog.dom.getElementByClass('slash', this._domElement);

	this._numeratorEl = goog.dom.getElementByClass('numerator', this._domElement);
	this._denominatorEl = goog.dom.getElementByClass('denominator', this._domElement);

	this._numeratorOnesEl = goog.dom.query('.ones', this._numeratorEl)[0];
	this._numeratorTensEl = goog.dom.query('.tens', this._numeratorEl)[0];
	this._numeratorHundredsEl = goog.dom.query('.hundreds', this._numeratorEl)[0];

	this._numeratorOnesDigits = goog.dom.query('span', this._numeratorOnesEl);
	this._numeratorTensDigits = goog.dom.query('span', this._numeratorTensEl);
	this._numeratorHundredsDigits = goog.dom.query('span', this._numeratorHundredsEl);

	//
	this._progressUpdateThrottle = new goog.async.Throttle( this.renderProgress, 350, this );

	this._hasProgress = false;
	this._animationProgress = 0;

	// animation
	var fadeInTweener = TweenMax.to(this._innerEl, .45, {
		opacity: 1,
		display: 'block',
		ease: Cubic.easeInOut
	});

	var portraitInTweener = TweenMax.fromTo(this._portraitEl, .8, {
		opacity: 0,
		scale: .8
	},{
		opacity: 1,
		scale: 1,
		ease: Expo.easeOut
	});

	this._animateInTweener.add(fadeInTweener);
	this._animateInTweener.add(portraitInTweener, '+=0', 'start', .25);

	var contentOutTweener = TweenMax.to(this._contentEl, .8, {
		opacity: 0,
		y: -80,
		ease: Cubic.easeInOut
	});

	var portraitOutTweener = TweenMax.to(this._portraitEl, .8, {
		delay: .25,
		opacity: 0,
		y: -40,
		ease: Cubic.easeInOut
	});

	var curtainTweener = TweenMax.fromTo(this._curtainEl, 1, {
		opacity: 0
	},{
		delay: .5,
		opacity: 1,
		display: 'block',
		ease: Cubic.easeInOut
	});

	this._animateOutTweener.add([contentOutTweener, portraitOutTweener, curtainTweener], '+=0', 'start', 0);
};
goog.inherits(hlc.views.Preloader, hlc.views.Loader);


hlc.views.Preloader.prototype.init = function(){

	// set initial style
	var i, l = 10;

	for(i = 0; i < l; i++) {
		goog.dom.classes.enable( this._numeratorOnesDigits[i], 'hidden', true );
		goog.dom.classes.enable( this._numeratorTensDigits[i], 'hidden', true );
		goog.dom.classes.enable( this._numeratorHundredsDigits[i], 'hidden', true );
	}

	goog.dom.classes.enable( this._numeratorHundredsEl, 'hidden', true );
	goog.dom.classes.enable( this._numeratorTensEl, 'hidden', true );
	goog.dom.classes.enable( this._numeratorOnesEl, 'hidden', true );

	TweenMax.set( [this._innerEl, this._slashEl, this._numeratorEl, this._denominatorEl, this._hintEl], {
		opacity: 0
	});

	TweenMax.set( this._curtainEl, {
		display: 'none'
	});

	// preload background image to start intro animation
	var backgroundSrc = goog.style.getComputedStyle( this._innerEl, 'background-image' ).replace('url(','').replace(')','');
	var hasBackgroundSrc = (backgroundSrc.length > 0);

	if(hasBackgroundSrc) {
		
		var img = new Image();
		img.src = backgroundSrc;

		goog.events.listenOnce(img, goog.events.EventType.LOAD, this.animateIn, false, this);

	}else {

		this.animateIn();
	}
};


hlc.views.Preloader.prototype.animateIn = function(){

	goog.base(this, 'animateIn');

	goog.dom.classlist.enable(document.body, 'hidden', false);
};


hlc.views.Preloader.prototype.animateInCounter = function(){

	TweenMax.fromTo(this._slashEl, .45, {
		opacity: 0,
		x: 30,
		y: -40
	}, {
		opacity: 1,
		x: 0,
		y: 0,
		ease: Expo.easeInOut
	});

	TweenMax.fromTo(this._numeratorEl, .45, {
		opacity: 0,
		x: -6,
		y: 10
	},{
		delay: .05,
		opacity: 1,
		x: 0,
		y: 0
	});

	TweenMax.fromTo(this._denominatorEl, .45, {
		opacity: 0,
		x: -6,
		y: 10
	},{
		delay: .10,
		opacity: 1,
		x: 0,
		y: 0
	});

	var denominatorDigits = goog.dom.query('.digits div', this._denominatorEl);
	goog.array.forEach(denominatorDigits, function(el, index) {
		TweenMax.fromTo(el, .45, {
			opacity: 0,
			x: -3,
			y: 7
		},{
			delay: index * 0.05 + .30,
			opacity: 1,
			x: 0,
			y: 0
		});
	});

	TweenMax.fromTo(this._hintEl, .65, {
		opacity: 0,
		y: 10
	}, {
		delay: .65,
		opacity: 1,
		y: 0
	});
};


hlc.views.Preloader.prototype.renderProgress = function() {

	var progress = Math.round(this._animationProgress * 100);

	var hasProgress = (progress >= 1);

	if(!hasProgress) {

		return;

	}else if(!this._hasProgress) {

		this._hasProgress = true;

		this.animateInCounter();
	}

	var progressStr = progress.toString();

	var ones, tens, hundreds;

	if(progressStr.length === 3) {

		ones = parseInt(progressStr[2]);
		tens = parseInt(progressStr[1]);
		hundreds = parseInt(progressStr[0]);

	}else if(progressStr.length === 2) {
		
		ones = parseInt(progressStr[1]);
		tens = parseInt(progressStr[0]);

	}else if(progressStr.length === 1) {
		
		ones = parseInt(progressStr[0]);
	}

	// update ones
	if(goog.isNumber(ones)) {

		goog.array.forEach(this._numeratorOnesDigits, function(digit, index) {

			var shouldShow = (index === ones);
			goog.dom.classes.enable( digit, 'hidden', !shouldShow );
		});

		goog.dom.classes.enable( this._numeratorOnesEl, 'hidden', false );
	}

	// update tens
	if(goog.isNumber(tens)) {

		goog.array.forEach(this._numeratorTensDigits, function(digit, index) {

			var shouldShow = (index === tens);
			goog.dom.classes.enable( digit, 'hidden', !shouldShow );
		});

		goog.dom.classes.enable( this._numeratorTensEl, 'hidden', false );
	}

	// update hundreds
	if(goog.isNumber(hundreds)) {

		goog.array.forEach(this._numeratorHundredsDigits, function(digit, index) {

			var shouldShow = (index === hundreds);
			goog.dom.classes.enable( digit, 'hidden', !shouldShow );
		});

		goog.dom.classes.enable( this._numeratorHundredsEl, 'hidden', false );
	}
};


hlc.views.Preloader.prototype.onProgress = function(e) {

	goog.base(this, 'onProgress', e);

	this._animationProgress = e.progress;

	this._progressUpdateThrottle.fire();
};


hlc.views.Preloader.prototype.onImageLoad = function(e) {

	goog.base(this, 'onImageLoad', e);

	this.assets[e.target.id] = e.target;
};


hlc.views.Preloader.prototype.onBulkSuccess = function(e) {

	var responseText = e.target.getResponseTexts();
	this.assets['sitemap'] = JSON.parse(responseText);

	goog.base(this, 'onBulkSuccess', e);
};


hlc.views.Preloader.prototype.onAnimatedOut = function(e) {

	goog.base(this, 'onAnimatedOut', e);

	TweenMax.set(this._domElement, {
		'display': 'none'
	});
};