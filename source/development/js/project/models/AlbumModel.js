goog.provide('hlc.models.AlbumModel');

goog.require('hlc.models.SongModel');
goog.require('goog.events.EventTarget');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.object');

/**
 * @constructor
 */
hlc.models.AlbumModel = function(albumId, albumData){
  goog.base(this);

  this.albumId = albumId;
  this.albumTitle = albumData['title'];
  this.albumCover = albumData['cover'];
  this.songs = [];

  var songsObj = albumData['songs'];
  goog.object.forEach(songsObj, function(songData, songId) {
    var songModel = new hlc.models.SongModel( songId, songData );
    this.songs.push(songModel);
  }, this);
};
goog.inherits(hlc.models.AlbumModel, goog.events.EventTarget);


hlc.models.AlbumModel.prototype.getSongAt = function(songIndex){
  
};


hlc.models.AlbumModel.prototype.getSong = function(songId){

};