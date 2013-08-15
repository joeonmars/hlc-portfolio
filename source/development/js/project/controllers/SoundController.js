goog.provide('hlc.controllers.SoundController');

goog.require('goog.array');
goog.require('goog.events.EventType');

hlc.controllers.SoundController = function() {
	goog.base(this);

	this._dispatchers = [];

	this.volume = 1;
	this.currentSound = null;

  // listen for all audio events
  goog.events.listen(this, hlc.models.SongModel.EventType.HTML_AUDIO_EVENTS, this.onAudioEvent, false, this);
  goog.events.listen(this, hlc.models.SongModel.EventType.AUDIO_DATA_LOAD, this.onAudioDataLoad, false, this);
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


hlc.controllers.SoundController.prototype.setProgress = function(progress) {
	this.currentSound.setProgress(progress);
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


hlc.controllers.SoundController.prototype.setCurrentSound = function(sound) {
	this.currentSound = sound;
};


hlc.controllers.SoundController.prototype.onAudioEvent = function(e) {
	switch(e.type) {
		case 'play':
		//console.log("PLAY", this);
		this.setVolume(this.volume);
		break;

		case 'pause':
		//console.log("PAUSE", this);
		break;

		case 'canplaythrough':
		//console.log(e.audio, 'can play through.');
		break;

		default:
		break;
	}

	goog.array.forEach(this._dispatchers, function(dispatcher) {
		dispatcher.dispatchEvent(e);
	});
};


hlc.controllers.SoundController.prototype.onAudioDataLoad = function(e) {
	goog.array.forEach(this._dispatchers, function(dispatcher) {
		dispatcher.dispatchEvent(e);
	});
};