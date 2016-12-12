"use strict";

const _ = require("underscore");

function Message(requiredArguments, optionalKeyboard, optionalTrackingData, timestamp, token) {
	this.timestamp = timestamp;
	this.token = token;
	this.trackingData = this._parseTrackingData(optionalTrackingData);
	this.keyboard = !optionalKeyboard ? null : optionalKeyboard;

	this._verifyNonNull(this, requiredArguments);
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

Message.prototype._verifyNonNull = function(object, requiredArguments) {
	requiredArguments.forEach(argument => {
		if (!_.has(object, argument) || !_.result(object, argument, null)) {
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

module.exports = Message;
