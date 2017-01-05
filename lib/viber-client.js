"use strict";

const _ = require('underscore');
const needle = require('needle');
const util = require('util');
const pjson = require(__dirname + '/../package.json');

const SUCCESSFUL_REQUEST_STATUS = 0;
const VIBER_AUTH_TOKEN_HEADER = "X-Viber-Auth-Token";
const MAX_GET_ONLINE_IDS = 100;
const API_ENDPOINTS = {
	"setWebhook": "/set_webhook",
	"getAccountInfo": "/get_account_info",
	"getUserDetails": "/get_user_details",
	"getOnlineStatus": "/get_online",
	"sendMessage": "/send_message"
};

function ViberClient(logger, bot, apiUrl, subscribedEvents) {
	this._logger = logger;
	this._bot = bot;
	this._url = apiUrl;
	this._subscribedEvents = subscribedEvents;
	this._userAgent = util.format("ViberBot-Node/%s", pjson.version);
}

ViberClient.prototype.setWebhook = function(url) {
	this._logger.info("Sending 'setWebhook' request for url: %s", url);
	return this._sendRequest("setWebhook", {
		"url": url,
		"event_types": this._subscribedEvents
	});
};

ViberClient.prototype.sendMessage = function(toViberUserId, messageType, messageData, optionalTrackingData, optionalKeyboard) {
	if (!toViberUserId || !messageType || !messageData) {
		throw new Error(`Invalid arguments passed to sendMessage. to, type and message are required`);
	}

	const request = {
		"receiver": toViberUserId,
		"sender": {
			"name": this._bot.name,
			"avatar": this._bot.avatar
		},
		"tracking_data": this._serializeTrackingData(optionalTrackingData),
		"keyboard": optionalKeyboard,
		"type": messageType
	};

	this._logger.debug("Sending %s message to viber user '%s' with data", messageType.toUpperCase(), toViberUserId, messageData);
	return this._sendRequest("sendMessage", Object.assign(request, messageData));
};

ViberClient.prototype.getAccountInfo = function() {
	return this._sendRequest("getAccountInfo", {});
};

ViberClient.prototype.getUserDetails = function(viberUserId) {
	if (!viberUserId) throw new Error(`Missing user id`);
	return this._sendRequest("getUserDetails", { "id": viberUserId });
};

ViberClient.prototype.getOnlineStatus = function(viberUserIds) {
	viberUserIds = _.isArray(viberUserIds) ? viberUserIds : [viberUserIds];

	if (_.isEmpty(viberUserIds)) throw new Error(`Empty or no user ids passed to getOnlineStatus`);
	if (_.size(viberUserIds) > MAX_GET_ONLINE_IDS) {
		throw new Error(`Can only check up to ${MAX_GET_ONLINE_IDS} ids per request`);
	}

	return this._sendRequest("getOnlineStatus", { "ids": viberUserIds });
};

ViberClient.prototype._sendRequest = function(endpoint, data) {
	if (!_.has(API_ENDPOINTS, endpoint)) {
		throw new Error(`could not find endpoint ${endpoint}`);
	}

	const self = this;
	const url = util.format("%s%s", this._url, API_ENDPOINTS[endpoint]);
	const dataWithAuthToken = Object.assign({ "auth_token": this._bot.authToken }, data);
	const options = {
		json: true, rejectUnauthorized: true, parse: true,
		user_agent: this._userAgent,
		headers: {
			[VIBER_AUTH_TOKEN_HEADER]: this._bot.authToken
		}
	};

	this._logger.debug("Opening request to url: '%s' with data", url, data);
	return new Promise((resolve, reject) => {
		try {
			needle.post(url, dataWithAuthToken, options)
				.on("data", data => self._readData(data, resolve, reject))
				.on("end", err => self._requestEnded(err, reject));
		}
		catch (err) {
			reject(err);
		}
	});
};

ViberClient.prototype._readData = function(data, resolve, reject) {
	if (data.status != SUCCESSFUL_REQUEST_STATUS) {
		this._logger.error("Response error", data);
		return reject(data);
	}
	this._logger.debug("Response data", data);
	return resolve(data);
};

ViberClient.prototype._requestEnded = function(err, reject) {
	if (err) {
		this._logger.error("Request ended with an error", err);
		return reject(err);
	}
	this._logger.debug("Request ended successfully");
};

ViberClient.prototype._serializeTrackingData = function(optionalTrackingData) {
	if (optionalTrackingData == null || _.isEmpty(optionalTrackingData)) {
		// because of bug in production, we cannot send null, but we can send an empty string
		optionalTrackingData = "";
	}
	return JSON.stringify(optionalTrackingData);
};

module.exports = ViberClient;
