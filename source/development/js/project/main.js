goog.provide('hlc.main');

goog.require('goog.fx.anim');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.style');
goog.require('soy');
goog.require('hlc.templates');
goog.require('hlc.views.AlbumSection');
goog.require('hlc.views.Footer');
goog.require('hlc.views.Preloader');
goog.require('hlc.views.Sidebar');
goog.require('hlc.views.MainHud');
goog.require('hlc.views.MastheadSection');
goog.require('hlc.controllers.NavigationController');
goog.require('hlc.controllers.WindowController');
goog.require('hlc.controllers.MainScrollController');
goog.require('hlc.controllers.AlbumScrollController');
goog.require('hlc.controllers.SoundController');


// define global paths
hlc.Url = {};
hlc.Url.ORIGIN = window.location.protocol + '//' + window.location.hostname + '/';
hlc.Url.STATIC_ASSETS = hlc.Url.ORIGIN + 'assets/static/';
hlc.Url.UPLOAD_ASSETS = hlc.Url.ORIGIN + 'assets/upload/';
hlc.Url.STATIC_IMAGES = hlc.Url.STATIC_ASSETS + 'images/';
hlc.Url.UPLOAD_IMAGES = hlc.Url.UPLOAD_ASSETS + 'images/';
hlc.Url.STATIC_SONGS = hlc.Url.STATIC_ASSETS + 'song/';
hlc.Url.UPLOAD_SONGS = hlc.Url.UPLOAD_ASSETS + 'song/';


hlc.main = function() {
	goog.fx.anim.setAnimationWindow(window);

	hlc.main.create();

	// init navigation controller
	//hlc.controllers.NavigationController.Implementation = hlc.controllers.NavigationController.HASH;
	hlc.main.controllers.navigationController.init();

	// start main preloader
	goog.events.listenOnce(hlc.main.views.preloader, goog.net.EventType.COMPLETE, hlc.main.onPreload, false, this);
	hlc.main.views.preloader.init();
	hlc.main.views.preloader.load();
};

hlc.main.create = function(e) {
	hlc.main.controllers.navigationController = hlc.controllers.NavigationController.getInstance();
	hlc.main.controllers.windowController = hlc.controllers.WindowController.getInstance();
	hlc.main.controllers.mainScrollController = hlc.controllers.MainScrollController.getInstance();
	hlc.main.controllers.albumScrollController = hlc.controllers.AlbumScrollController.getInstance();
	hlc.main.controllers.soundController = hlc.controllers.SoundController.getInstance();

	hlc.main.views.preloader = new hlc.views.Preloader();
	hlc.main.views.sidebar = new hlc.views.Sidebar();
	hlc.main.views.mainHud = new hlc.views.MainHud();
	hlc.main.views.footer = new hlc.views.Footer();
	hlc.main.views.mastheadSection = new hlc.views.MastheadSection(goog.dom.getElementByClass('masthead'));
	hlc.main.views.albumSections = hlc.main.controllers.albumScrollController.albumSections;
};

hlc.main.onPreload = function(e) {
	hlc.main.assets = e.assets;
	console.log(e.assets);

	// init components
	hlc.main.controllers.mainScrollController.init();
	hlc.main.controllers.albumScrollController.init();
	hlc.main.views.sidebar.init();
	hlc.main.views.mainHud.init();
	hlc.main.views.mastheadSection.init();
	hlc.main.views.footer.init();
};

hlc.main.controllers = {};
hlc.main.views = {};
hlc.main.assets = null;

// export
goog.exportProperty(window, 'hlc', hlc);
goog.exportProperty(hlc, 'main', hlc.main);