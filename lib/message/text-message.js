"use strict";

const util = require('util');
const Message = require(__dirname + '/message');
const REQUIRED_ARGUMENTS = ["text"];

function TextMessage(text, optionalKeyboard, optionalTrackingData, timestamp, token, minApiVersion) {
	this.text = text;

	TextMessage.super_.apply(this, [REQUIRED_ARGUMENTS, optionalKeyboard, optionalTrackingData, timestamp, token, minApiVersion]);
}
util.inherits(TextMessage, Message);

TextMessage.fromJson = function(jsonMessage, timestamp, token) {
	return new TextMessage(jsonMessage.text, null, jsonMessage.tracking_data, timestamp, token);
};

TextMessage.getType = function() {
	return "text";
};

TextMessage.prototype.toJson = function() {
	return {
		"type": TextMessage.getType(),
		"text": this.text
	};
};

module.exports = TextMessage;
