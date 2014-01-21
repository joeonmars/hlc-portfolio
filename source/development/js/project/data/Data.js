goog.provide( 'hlc.data.Data' );

goog.require( 'goog.array' );
goog.require( 'goog.dom' );
goog.require( 'hlc.utils' );

hlc.data.Data = function() {
	// hardcoded assets to preload
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

	// add playlist background images to preload assets
	var playlistHeadings = goog.dom.query('#playlist .heading');
	goog.array.forEach(playlistHeadings, function(dom) {
		var url = hlc.utils.getBackgroundImageUrl(dom);
		this.preloadAssets.push(url);
	}, this);
};
goog.addSingletonGetter(hlc.data.Data);