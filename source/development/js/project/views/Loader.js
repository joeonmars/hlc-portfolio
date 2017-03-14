goog.provide( 'hlc.views.Loader' );

goog.require( 'goog.async.Throttle' );
goog.require( 'goog.fx.anim' );
goog.require( 'goog.dom' );
goog.require( 'goog.events.EventTarget' );
goog.require( 'goog.events.EventHandler' );
goog.require( 'goog.math.Size' );
goog.require( 'goog.math.Box' );
goog.require( 'goog.net.EventType' );
goog.require( 'goog.net.BulkLoader' );
goog.require( 'goog.net.ImageLoader' );
goog.require( 'goog.object' );


/** @constructor */
hlc.views.Loader = function (bulkAssets, imageAssets, duration) {

	goog.base(this);

	// loader properties
	this._loadedAssets = 0;
	this._totalAssets = 0;
	this._progress = 0;

	this._isLoaded = false;

	// event handler
	this._eventHandler = new goog.events.EventHandler(this);

	// bulk loader
	this._bulkAssets = null;
	this._bulkAssetsKeys = null;
	this._bulkAssetsValues = null;

	this.bulkLoader = this.createBulkLoader(bulkAssets);

	// image loader
	this._imageAssets = null;

	this.imageLoader = this.createImageLoader(imageAssets);

	// loaders to execute
	this._loaders = [this.bulkLoader, this.imageLoader];

	// animation
	this._animateInTweener = new TimelineMax({
		'paused': true,
		'onComplete': this.onAnimatedIn,
		'onCompleteScope': this
	});

	this._animateOutTweener = new TimelineMax({
		'paused': true,
		'onComplete': this.onAnimatedOut,
		'onCompleteScope': this
	});

	this._duration = duration || 0;
	
	this._progressThrottle = new goog.async.Throttle( this.animateToProgress, 500, this );

	this._progressProps = {
		progress: 0
	};

	this._progressTweener = new TweenMax(this._progressProps, 0, {
		progress: 0,
		ease: Linear.easeNone,
		onUpdate: this.onProgressUpdate,
		onUpdateScope: this
	});
};
goog.inherits(hlc.views.Loader, goog.events.EventTarget);


hlc.views.Loader.prototype.disposeInternal = function() {
	goog.base(this, 'disposeInternal');

	// stop animation
	goog.fx.anim.unregisterAnimation(this);

	this._progressTweener.kill();
	this._progressThrottle.dispose();

	// kill tweener instances
	this._animateInTweener.kill();
	this._animateOutTweener.kill();

	// reset properties
	this.reset();
};


hlc.views.Loader.prototype.isLoaded = function() {
	return this._isLoaded;
};


hlc.views.Loader.prototype.reset = function() {
	this._eventHandler.removeAll();

	if(this.bulkLoader) {
		this._bulkAssets = null;
		this._bulkAssetsKeys = null;
		this._bulkAssetsValues = null;

		this.bulkLoader.dispose();
	}

	if(this.imageLoader) {
		this._imageAssets = null;

		this.imageLoader.dispose();
	}

	this._isLoaded = false;
	this._loadedAssets = 0;
	this._totalAssets = 0;
	this._progress = 0;
	this.updateProgress();
};


hlc.views.Loader.prototype.animateIn = function() {
	this._animateInTweener.play();
};


hlc.views.Loader.prototype.animateOut = function() {
	this._animateOutTweener.play();
};


hlc.views.Loader.prototype.createBulkLoader = function(assets) {
	if(!assets) {
		this.bulkLoader = null;
		return this.bulkLoader;
	}

	this._bulkAssets = assets;
	this._bulkAssetsKeys = goog.object.getKeys(this._bulkAssets);
	this._bulkAssetsValues = goog.object.getValues(this._bulkAssets);

	this.bulkLoader = new goog.net.BulkLoader( this._bulkAssetsValues );
	this._eventHandler.listen(this.bulkLoader, goog.net.EventType.SUCCESS, this.onBulkSuccess, false, this);
	this._eventHandler.listen(this.bulkLoader, goog.net.EventType.ERROR, this.onBulkError, false, this);

	this._totalAssets += this._bulkAssetsValues.length;

	return this.bulkLoader;
};


hlc.views.Loader.prototype.createImageLoader = function(assets) {
	if(!assets) {
		this.imageLoader = null;
		return this.imageLoader;
	}

	this._imageAssets = assets;

	this.imageLoader = new goog.net.ImageLoader();

	goog.object.forEach(this._imageAssets, function(imageAssetUrl, imageAssetKey) {
		this.imageLoader.addImage(imageAssetKey, imageAssetUrl);
	}, this);

	this._eventHandler.listen(this.imageLoader, goog.events.EventType.LOAD, this.onImageLoad, false, this);
	this._eventHandler.listen(this.imageLoader, goog.net.EventType.COMPLETE, this.onImageComplete, false, this);
	this._eventHandler.listen(this.imageLoader, goog.net.EventType.ERROR, this.onImageError, false, this);
	this._eventHandler.listen(this.imageLoader, goog.net.EventType.ABORT, this.onImageAbort, false, this);

	this._totalAssets += goog.object.getCount(assets);

	return this.imageLoader;
};


hlc.views.Loader.prototype.start = function(loaders) {
	this._loaders = loaders || this._loaders;

	// remove empty loaders
	this._loaders = goog.array.filter(this._loaders, function(loader) {
		return goog.isDefAndNotNull(loader);
	});

	// start the first available loader
	for(var i = 0; i < this._loaders.length; ++i) {
		var loader = this._loaders[i];

		if(loader === this.bulkLoader) {
			this.bulkLoader.load();
			break;
		}else if(loader === this.imageLoader) {
			this.imageLoader.start();
			break;
		}
	}

	// start animation
	if(!this.bulkLoader && !this.imageLoader) {
		this.onLoadComplete();
	}

	this._eventHandler.listen(this, hlc.events.EventType.PROGRESS, this.onProgress, false, this);

	goog.fx.anim.registerAnimation(this);
};


hlc.views.Loader.prototype.animateToProgress = function() {

	var progress = this._loadedAssets / this._totalAssets;
	var timeDiff = (progress - this._progressProps.progress) * this._duration;

	if (timeDiff > 0) {
		this._progressTweener.duration(timeDiff).updateTo({
			progress: progress
		}, true);
	}
};


hlc.views.Loader.prototype.onProgressUpdate = function() {

	var progress = this._progressProps.progress;

	this.dispatchEvent({
		type: hlc.events.EventType.PROGRESS,
		progress: progress
	});

	if (progress >= 1) {
		this.onAnimationComplete();
	}
};


hlc.views.Loader.prototype.updateProgress = function() {
	this._progress = this._loadedAssets / this._totalAssets;
};


hlc.views.Loader.prototype.onAnimatedIn = function(e) {
	this.start();

	this.dispatchEvent({
		type: hlc.events.EventType.ANIMATE_IN_COMPLETE
	});
};


hlc.views.Loader.prototype.onAnimatedOut = function(e) {
	this.dispatchEvent({
		type: hlc.events.EventType.ANIMATE_OUT_COMPLETE
	});
};


hlc.views.Loader.prototype.onAnimationFrame = function(now) {

	this._progressThrottle.fire();
};


hlc.views.Loader.prototype.onAnimationComplete = function(e) {

	// stop animation
	goog.fx.anim.unregisterAnimation(this);

	this._progressTweener.kill();
	this._progressThrottle.dispose();

	// start animate out
	this.animateOut();

	this.dispatchEvent({
		type: goog.net.EventType.COMPLETE
	});
};


hlc.views.Loader.prototype.onProgress = function(e) {

};


hlc.views.Loader.prototype.onBulkSuccess = function(e) {
	this._loadedAssets += this._bulkAssetsValues.length;
	this.updateProgress();

	var loaderIndex = goog.array.indexOf(this._loaders, e.target);

	if(loaderIndex >= this._loaders.length - 1) {
		this.onLoadComplete();
	}else {
		this.imageLoader.start();
	}
};


hlc.views.Loader.prototype.onBulkError = function(e) {
	console.log('Bulk loader error', e, this);
};


hlc.views.Loader.prototype.onLoadComplete = function() {
	console.log('Load complete, loaded assets: ' + this._loadedAssets, this);

	this._progress = 1;
	this._isLoaded = true;

	this._progressThrottle.stop();
};


hlc.views.Loader.prototype.onImageLoad = function(e) {
	this._loadedAssets ++;
	this.updateProgress();
};


hlc.views.Loader.prototype.onImageComplete = function(e) {
	var loaderIndex = goog.array.indexOf(this._loaders, e.target);

	if(loaderIndex >= this._loaders.length - 1) {
		this.onLoadComplete();
	}else {
		this.bulkLoader.load();
	}
};


hlc.views.Loader.prototype.onImageError = function(e) {

};


hlc.views.Loader.prototype.onImageAbort = function(e) {

};