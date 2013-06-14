goog.provide('hlc.main');

goog.require('goog.fx.anim');
goog.require('goog.dom');
goog.require('goog.style');
goog.require('soy');
goog.require('hlc.templates');
goog.require('hlc.views.Sidebar');
goog.require('hlc.views.MainHud');
goog.require('hlc.views.MastheadSection');
goog.require('hlc.controllers.NavigationController');
goog.require('hlc.controllers.WindowController');
goog.require('hlc.controllers.MainScrollController');
goog.require('hlc.controllers.AlbumScrollController');

hlc.Url = {
	ORIGIN: window.location.protocol + '//' + window.location.hostname + '/'
};

hlc.main = function() {
	goog.fx.anim.setAnimationWindow(window);

	//hlc.controllers.NavigationController.Implementation = hlc.controllers.NavigationController.HASH;
	hlc.main.controllers.navigationController.init();
};

hlc.main.controllers = {
	navigationController: hlc.controllers.NavigationController.getInstance(),
	windowController: hlc.controllers.WindowController.getInstance(),
	mainScrollController: hlc.controllers.MainScrollController.getInstance(),
	albumScrollController: hlc.controllers.AlbumScrollController.getInstance()
};

hlc.main.views = {
	sidebar: new hlc.views.Sidebar(),
	mainHud: new hlc.views.MainHud(),
	mastheadSection: new hlc.views.MastheadSection(goog.dom.getElementByClass('masthead'))
}

// test
hlc.main.controllers.mainScrollController.init();
hlc.main.views.sidebar.init();
hlc.main.views.mainHud.init();
hlc.main.views.mastheadSection.init();

// export
goog.exportProperty(window, 'hlc', hlc);
goog.exportProperty(hlc, 'main', hlc.main);