goog.provide('hlc.models.AnimationModel');

goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.style');


hlc.models.AnimationModel.getAnimaticTitleTweener = function(domElement) {
	var titleDom = goog.dom.query('h3', domElement)[0];
	var lineDom = goog.dom.query('.line', domElement)[0];
	var fillDom = goog.dom.query('.fill', lineDom)[0];
	var height = goog.style.getSize(domElement).height;

	var tweener = new TimelineMax();
	tweener.add( TweenMax.fromTo(lineDom, .8, {opacity: 0}, {opacity: 1}) );
	tweener.add( TweenMax.fromTo(fillDom, .5, {width: '0%'}, {width: '100%', ease: Quad.easeOut}), .5 );
	tweener.add( TweenMax.fromTo(titleDom, .8, {opacity: 0, transform: 'translateY(' + height + 'px)'}, {opacity: 1, transform: 'translateY(0px)', ease: Quad.easeInOut}), .8 );

	return tweener;
};