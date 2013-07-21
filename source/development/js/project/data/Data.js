goog.provide('hlc.data.Data');

hlc.data.Data = function() {
	this.preloadAssets = [
		hlc.Url.STATIC_IMAGES + 'backgrounds/masthead.jpg',
		hlc.Url.STATIC_IMAGES + 'backgrounds/heading.jpg',
		hlc.Url.STATIC_IMAGES + 'visualizer-gradient.png',
		hlc.Url.STATIC_IMAGES + 'visualizer-back.jpg',
		hlc.Url.STATIC_IMAGES + 'visualizer-head.png',
		hlc.Url.STATIC_IMAGES + 'triangle-button-black.png',
		hlc.Url.STATIC_IMAGES + 'triangle-button-white.png',
		hlc.Url.STATIC_IMAGES + 'album-tile.png'
	];
};
goog.addSingletonGetter(hlc.data.Data);