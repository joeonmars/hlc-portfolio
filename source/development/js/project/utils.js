goog.provide( 'hlc.utils' );

goog.require( 'goog.window' );

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