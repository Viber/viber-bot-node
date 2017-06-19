"use strict";

const util = require('util');
const Message = require(__dirname + '/message');
const REQUIRED_ARGUMENTS = ["keyboard"];

function KeyboardMessage(keyboard, optionalTrackingData, timestamp, token, minApiVersion) {
	KeyboardMessage.super_.apply(this, [REQUIRED_ARGUMENTS, keyboard, optionalTrackingData, timestamp, token, minApiVersion]);
}
util.inherits(KeyboardMessage, Message);

KeyboardMessage.fromJson = function(jsonMessage, timestamp, token) {
	return new KeyboardMessage(jsonMessage.keyboard, jsonMessage.tracking_data, timestamp, token);
};

KeyboardMessage.getType = function() {
	return null;
};

KeyboardMessage.prototype.toJson = function() {
	return {};
};

module.exports = KeyboardMessage;
