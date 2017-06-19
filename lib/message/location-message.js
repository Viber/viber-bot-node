"use strict";

const util = require('util');
const Message = require(__dirname + '/message');
const REQUIRED_ARGUMENTS = ["latitude", "longitude"];

function LocationMessage(latitude, longitude, optionalKeyboard, optionalTrackingData, timestamp, token, minApiVersion) {
	this.latitude = latitude;
	this.longitude = longitude;

	LocationMessage.super_.apply(this, [REQUIRED_ARGUMENTS, optionalKeyboard, optionalTrackingData, timestamp, token, minApiVersion]);
}
util.inherits(LocationMessage, Message);

LocationMessage.fromJson = function(jsonMessage, timestamp, token) {
	return new LocationMessage(jsonMessage.location.lat, jsonMessage.location.lon,
		null, jsonMessage.tracking_data, timestamp, token);
};

LocationMessage.getType = function() {
	return "location";
};

LocationMessage.prototype.toJson = function() {
	return {
		"type": LocationMessage.getType(),
		"location": {
			"lat": this.latitude,
			"lon": this.longitude
		}
	};
};

module.exports = LocationMessage;
