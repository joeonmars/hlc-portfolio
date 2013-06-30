goog.provide('hlc.controllers.SoundController');

goog.require('goog.array');
goog.require('goog.events.EventType');

hlc.controllers.SoundController = function() {
	goog.base(this);

	this._dispatchers = [];

	this.volume = 1;
	this.currentSound = null;

  // listen for audio events
  goog.events.listen(this, ['play', 'pause', 'timeupdate', 'canplaythrough'], this.onAudioEvent, false, this);
};
goog.inherits(hlc.controllers.SoundController, goog.events.EventTarget);
goog.addSingletonGetter(hlc.controllers.SoundController);


hlc.controllers.SoundController.prototype.addDispatcher = function(dispatcher) {
	if(!goog.array.contains(this._dispatchers, dispatcher)) {
		this._dispatchers.push(dispatcher);
	}
};


hlc.controllers.SoundController.prototype.removeDispatcher = function(dispatcher) {
	if(goog.array.contains(this._dispatchers, dispatcher)) {
		goog.array.remove(this._dispatchers, dispatcher);
	}
};


hlc.controllers.SoundController.prototype.play = function() {
	this.currentSound.play();
};


hlc.controllers.SoundController.prototype.pause = function() {
	this.currentSound.pause();
};


hlc.controllers.SoundController.prototype.isPaused = function() {
	return this.currentSound.isPaused();
};


hlc.controllers.SoundController.prototype.setVolume = function(volume) {
	this.volume = volume;

	if(this.currentSound) {
		this.currentSound.setVolume( this.volume );
	}
};


hlc.controllers.SoundController.prototype.onAudioEvent = function(e) {
	this.currentSound = e.target;

	switch(e.type) {
		case 'play':
		this.setVolume(this.volume);
		break;

		case 'pause':

		break;

		case 'canplaythrough':
		console.log(e.audio, 'can play through.');
		break;

		default:
		break;
	}

	goog.array.forEach(this._dispatchers, function(dispatcher) {
		dispatcher.dispatchEvent(e);
	});
};