"use strict";

const util = require('util');
const Message = require(__dirname + '/message');
const REQUIRED_ARGUMENTS = ["url"];

// current issue: size is mandatory when sending, but optional on receiving
function VideoMessage(url, size, optionalThumbnail, optionalDuration, optionalKeyboard, optionalTrackingData, timestamp, token) {
	this.url = url;
	this.size = size;
	this.thumbnail = !optionalThumbnail ? null : optionalThumbnail;
	this.duration = !optionalDuration ? null : optionalDuration;

	VideoMessage.super_.apply(this, [REQUIRED_ARGUMENTS, optionalKeyboard, optionalTrackingData, timestamp, token]);
}
util.inherits(VideoMessage, Message);

VideoMessage.fromJson = function(jsonMessage, timestamp, token) {
	return new VideoMessage(jsonMessage.media, jsonMessage.size, jsonMessage.thumbnail, jsonMessage.duration,
		null, jsonMessage.tracking_data, timestamp, token);
};

VideoMessage.getType = function() {
	return "video";
};

VideoMessage.prototype.toJson = function() {
	return {
		"type": VideoMessage.getType(),
		"media": this.url,
		"thumbnail": this.thumbnail,
		"size": this.size,
		"duration": this.duration
	};
};

module.exports = VideoMessage;
