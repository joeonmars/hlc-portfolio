goog.provide( 'hlc.data.Data' );

goog.require( 'goog.array' );
goog.require( 'goog.dom' );
goog.require( 'hlc.utils' );

hlc.data.Data = function() {

	// hardcoded assets to preload
	this.preloadAssets = {
		'masthead': hlc.Url.STATIC_IMAGES + 'backgrounds/masthead.jpg',
		'heading': hlc.Url.STATIC_IMAGES + 'backgrounds/heading.jpg',
		'visualizer-gradient': hlc.Url.STATIC_IMAGES + 'visualizer-gradient.png',
		'visualizer-back': hlc.Url.STATIC_IMAGES + 'visualizer-back.jpg',
		'visualizer-head': hlc.Url.STATIC_IMAGES + 'visualizer-head.png',
		'triangle-button-black': hlc.Url.STATIC_IMAGES + 'triangle-button-black.png',
		'triangle-button-white': hlc.Url.STATIC_IMAGES + 'triangle-button-white.png',
		'album-tile': hlc.Url.STATIC_IMAGES + 'album-tile.png'
	};

	// preload low res portrait image sequence
	for(var i = 0; i < 60; i++) {

		var id = 'portrait-lowres-'+i;
		var url = hlc.Url.STATIC_IMAGES + 'portrait/lowres/' + goog.string.padNumber(i, 2) + '.png';
		this.addAsset( id, url );
	}

	// add playlist background images to preload assets
	var playlistHeadings = goog.dom.query('#playlist .heading');

	goog.array.forEach(playlistHeadings, function(dom, index) {

		var url = hlc.utils.getBackgroundImageUrl(dom);
		this.addAsset( 'playlist-heading-'+index, url );

	}, this);
};
goog.addSingletonGetter(hlc.data.Data);


hlc.data.Data.prototype.addAsset = function(id, url) {

	this.preloadAssets[id] = url;

	return this.preloadAssets;
};