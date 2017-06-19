"use strict";

const _ = require("underscore");

function Message(requiredArguments, optionalKeyboard, optionalTrackingData, timestamp, token, minApiVersion) {
	this.timestamp = timestamp;
	this.token = token;
	this.trackingData = this._parseTrackingData(optionalTrackingData);
	this.keyboard = !optionalKeyboard ? null : optionalKeyboard;
	this.requiredArguments = requiredArguments;
	this.minApiVersion = minApiVersion;

	Object.freeze(this);
}

Message.fromJson = function(jsonMessage, timestamp, token) {
	throw new Error("not implemented");
};

Message.getType = function() {
	throw new Error("not implemented");
};

Message.prototype.toJson = function() {
	throw new Error("not implemented");
};

Message.prototype.verifyMessage = function() {
	this.requiredArguments.forEach(argument => {
		if (!_.has(this, argument) || !_.result(this, argument, null)) {
			throw new Error(`Missing required argument ${argument}`);
		}
	});
};

Message.prototype._parseTrackingData = function(optionalTrackingData) {
	if (!optionalTrackingData) return {};
	if (_.isObject(optionalTrackingData)) return optionalTrackingData;

	let trackingData = null;
	try {
		trackingData = JSON.parse(optionalTrackingData);
	}
	catch (err) {
	}
	return !_.isObject(trackingData) ? {} : trackingData;
};

Message.prototype.serializeObject = function(object) {
	if (object == null || _.isEmpty(object)) {
		// because of bug in production, we cannot send null, but we can send an empty string
		object = "";
	}
	return JSON.stringify(object);
};

module.exports = Message;
