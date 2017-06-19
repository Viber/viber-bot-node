"use strict";

const util = require('util');
const Message = require(__dirname + '/message');
const REQUIRED_ARGUMENTS = ["url"];

function PictureMessage(url, optionalText, optionalThumbnail, optionalKeyboard, optionalTrackingData, timestamp, token, minApiVersion) {
	this.url = url;
	this.text = optionalText || null;
	this.thumbnail = optionalThumbnail || null;

	PictureMessage.super_.apply(this, [REQUIRED_ARGUMENTS, optionalKeyboard, optionalTrackingData, timestamp, token, minApiVersion]);
}
util.inherits(PictureMessage, Message);

PictureMessage.fromJson = function(jsonMessage, timestamp, token) {
	return new PictureMessage(jsonMessage.media, jsonMessage.text, jsonMessage.thumbnail, null, jsonMessage.tracking_data, timestamp, token);
};

PictureMessage.getType = function() {
	return "picture";
};

PictureMessage.prototype.toJson = function() {
	return {
		"type": PictureMessage.getType(),
		"text": this.text,
		"media": this.url,
		"thumbnail": this.thumbnail
	};
};

module.exports = PictureMessage;
