goog.provide('hlc.models.AlbumModel');

goog.require('hlc.models.SongModel');
goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.object');

/**
 * @constructor
 */
hlc.models.AlbumModel = function(albumId){
  goog.base(this);

  this.albumId = albumId;
  this.songs = [];

  var songsObj = hlc.main.assets.sitemap['albums'][this.albumId]['songs'];
  goog.object.forEach(songsObj, function(value, songId) {
    var songModel = new hlc.models.SongModel( songId );
    this.songs.push(songModel);
  }, this);
};
goog.inherits(hlc.models.AlbumModel, goog.events.EventTarget);


hlc.models.AlbumModel.prototype.getSongAt = function(songIndex){
  
};


hlc.models.AlbumModel.prototype.getSong = function(songId){

};