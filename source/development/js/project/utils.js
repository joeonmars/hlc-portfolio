goog.provide( 'hlc.utils' );

goog.require( 'goog.window' );
goog.require( 'goog.events.EventHandler' );
goog.require( 'goog.userAgent' );

hlc.utils.popUpWindow = function(url, width, height, options) {
	var viewportSize = goog.dom.getViewportSize();

	var options = options || {
		'toolbar': false,
		'scrollbars': false,
		'statusbar': false,
		'menubar': false,
		'resizable': false
	};

	goog.window.open(url, {
		'width': width,
		'height': height,
		'left': (window.screenLeft || window.screenX) + (viewportSize.width - width)/2,
		'top': (window.screenTop || window.screenY) + (viewportSize.height - height)/2,
		'toolbar': options['toolbar'],
		'scrollbars': options['scrollbars'],
		'statusbar': options['statusbar'],
		'menubar': options['menubar'],
		'resizable': options['resizable']
	});
};


hlc.utils.runSocialButtonScripts = function() {
		/* facebook */
		var fbRootDom = goog.dom.createDom('div', {'id': 'fb-root'});
		goog.dom.appendChild(document.body, fbRootDom);

		(function(d, s, id) {
		  var js, fjs = d.getElementsByTagName(s)[0];
		  if (d.getElementById(id)) return;
		  js = d.createElement(s); js.id = id;
		  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
		  fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));

		/* twitter */
		!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');

		/* google plus */
	  (function() {
	    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
	    po.src = 'https://apis.google.com/js/plusone.js';
	    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
	  })();

		/* getglue */
		var scriptTag = goog.dom.createDom('script', {'src': "http://widgets.getglue.com/checkin.js", 'type': "text/javascript"});
		goog.dom.appendChild(document.body, scriptTag);
};


hlc.utils.getTouchCoordinate = function(e) {
	var touchX = e.touches ? e.touches[0].pageX : e.clientX;
	var touchY = e.touches ? e.touches[0].pageY : e.clientY;
	var coord = {x:touchX, y:touchY};
	return coord;
}


hlc.utils.grabCursor = function(domElement) {
	var handler = new goog.events.EventHandler();

	var add = function() {
		goog.dom.classes.add(domElement, 'grab');

		handler.listen(domElement, 'mousedown', function(e) {
			e.preventDefault();
			goog.dom.classes.add(domElement, 'grabbing');
		});

		handler.listen(domElement, 'mouseup', function(e) {
			goog.dom.classes.remove(domElement, 'grabbing');
		});
	};

	var remove = function() {
		goog.dom.classes.remove(domElement, 'grab');
		handler.removeAll();
	};

	var dispose = function() {
		remove();
		handler.dispose();
	};

	add();

	return {
		add: add,
		remove: remove,
		dispose: dispose
	};
}


hlc.utils.getBackgroundImageUrl = function(domElement) {
	return domElement.style.backgroundImage.slice(4, -1);
};


hlc.utils.isTablet = function() {
	return (goog.userAgent.IPAD || goog.userAgent.ANDROID || goog.userAgent.WINDOWS);
};


hlc.utils.isRetina = function() {
	return !(window.devicePixelRatio === 1);
};