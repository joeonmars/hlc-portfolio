goog.provide('hlc.controllers.SocialController');

goog.require('goog.events.EventTarget');
goog.require('goog.events');

/**
 * @constructor
 */
hlc.controllers.SocialController = function(){
  goog.base(this);

	/* facebook */
	/* removed due to the use of iframe version
	var fbRootDom = goog.dom.createDom('div', {'id': 'fb-root'});
	goog.dom.appendChild(document.body, fbRootDom);

	(function(d, s, id) {
	  var js, fjs = d.getElementsByTagName(s)[0];
	  if (d.getElementById(id)) return;
	  js = d.createElement(s); js.id = id;
	  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&status=0";
	  fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
	*/

	/* twitter */
	!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');

	/* google plus */
  (function() {
    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/plusone.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
  })();
};
goog.inherits(hlc.controllers.SocialController, goog.events.EventTarget);
goog.addSingletonGetter(hlc.controllers.SocialController);