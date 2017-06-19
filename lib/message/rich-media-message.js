"use strict";

const util = require('util');
const Message = require(__dirname + '/message');
const REQUIRED_ARGUMENTS = ["richMedia"];

function RichMediaMessage(richMedia, optionalKeyboard, optionalTrackingData, timestamp, token, optionalAltText, minApiVersion) {
	this.richMedia = richMedia;
	this.altText = !optionalAltText ? null : optionalAltText;

	RichMediaMessage.super_.apply(this, [REQUIRED_ARGUMENTS, optionalKeyboard, optionalTrackingData, timestamp, token, minApiVersion]);
}
util.inherits(RichMediaMessage, Message);

RichMediaMessage.fromJson = function(jsonMessage, timestamp, token) {
	return new RichMediaMessage(jsonMessage.rich_media, null, jsonMessage.tracking_data, timestamp, token, jsonMessage.alt_text);
};

RichMediaMessage.getType = function() {
	return "rich_media";
};

RichMediaMessage.prototype.toJson = function() {
	return {
		"type": RichMediaMessage.getType(),
		"rich_media": this.richMedia,
		"alt_text": this.altText || null,
		"min_api_version": 2
	};
};

module.exports = RichMediaMessage;
