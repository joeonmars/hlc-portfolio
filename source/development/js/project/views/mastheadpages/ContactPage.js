goog.provide('hlc.views.mastheadpages.ContactPage');

goog.require('hlc.views.mastheadpages.MastheadPage');
goog.require('goog.dom');
goog.require('goog.net.XhrIo');
goog.require("goog.structs.Map");
goog.require("goog.Uri.QueryData");

/**
 * @constructor
 */
hlc.views.mastheadpages.ContactPage = function(){
	var domElement = goog.dom.getElement('contact');
	var url = hlc.Url.INCLUDES + 'contact';

  goog.base(this, domElement, url, 'contact');

  this._postRequest = null;
  this._sendButtonDom = null;
};
goog.inherits(hlc.views.mastheadpages.ContactPage, hlc.views.mastheadpages.MastheadPage);


hlc.views.mastheadpages.ContactPage.prototype.createPageElements = function(){
	goog.base(this, 'createPageElements');

	this._postRequest = new goog.net.XhrIo();
	this._sendButtonDom = goog.dom.getElementByClass('sendButton', this.domElement);
};


hlc.views.mastheadpages.ContactPage.prototype.activate = function(){
	goog.base(this, 'activate');

	goog.events.listen(this._sendButtonDom, 'click', this.onClickSendButton, false, this);
	goog.events.listen(this._postRequest, goog.net.EventType.READY_STATE_CHANGE, this.onReadyStateChange, false, this);
};


hlc.views.mastheadpages.ContactPage.prototype.deactivate = function(){
	goog.base(this, 'deactivate');

	goog.events.unlisten(this._sendButtonDom, 'click', this.onClickSendButton, false, this);
	goog.events.unlisten(this._postRequest, goog.net.EventType.READY_STATE_CHANGE, this.onReadyStateChange, false, this);
};


hlc.views.mastheadpages.ContactPage.prototype.onClickSendButton = function(e){
	var formDom = goog.dom.getElement('contact-form');
	var senderNameDom = goog.dom.getElementByClass('senderName', formDom);
	var senderEmailDom = goog.dom.getElementByClass('senderEmail', formDom);
	var subjectDom = goog.dom.getElementByClass('subject', formDom);
	var messageDom = goog.dom.getElementByClass('message', formDom);

	var recipentName = hlc.main.assets.sitemap['contact']['emailOwner'];
	var recipentEmail = hlc.main.assets.sitemap['contact']['emailAddress'];
	var senderName = senderNameDom.value;
	var senderEmail = senderEmailDom.value;
	var subject = subjectDom.value;
	var message = messageDom.value;

	var data = goog.Uri.QueryData.createFromMap( new goog.structs.Map({
		'recipentName': recipentName,
		'recipentEmail': recipentEmail,
		'senderName': senderName,
		'senderEmail': senderEmail,
		'subject': subject,
		'message': message
	}));

	var dataStr = data.toString();

	this._postRequest.send(
		hlc.Url.ORIGIN + 'php/contact.php?ajax=true',
		'POST',
		dataStr
	);
};


hlc.views.mastheadpages.ContactPage.prototype.onReadyStateChange = function(e){
	switch(e.target.getReadyState()) {
		case goog.net.XmlHttp.ReadyState.LOADING:
		console.log('loading');
		break;

		case goog.net.XmlHttp.ReadyState.COMPLETE:
		this.onRequestComplete(e);
		break;
	}
};


hlc.views.mastheadpages.ContactPage.prototype.onRequestComplete = function(e){
	var request = e.target;

	if(request.isSuccess()) {

		// print confirm to the console
		console.log("Satus code: ", request.getStatus(), " - ", request.getStatusText());

		var response = goog.string.trim( request.getResponseText() );
		
		switch(response) {
			case 'success':
			this.onMessageSentSuccess();
			break;

			case 'error':
			this.onMessageSentFail();
			break;
		}

	}
};


hlc.views.mastheadpages.ContactPage.prototype.onMessageSentSuccess = function(){
	console.log('successfully sent message.');
};


hlc.views.mastheadpages.ContactPage.prototype.onMessageSentFail = function(){
	console.log('failed to send message.');
};