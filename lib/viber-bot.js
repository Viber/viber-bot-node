"use strict";

const _ = require('underscore');
const util = require('util');
const EventEmitter = require('events');
const JSONBig = require('json-bigint')({"storeAsString": true});

const NoopLogger = require(__dirname + '/noop-logger');
const EventConsts = require(__dirname + '/event-consts');
const ViberClient = require(__dirname + '/viber-client');
const Middleware = require(__dirname + '/middleware');
const RegexMatcherRouter = require(__dirname + '/regex-matcher-router');

const MessageFactory = require(__dirname + '/message/message-factory');
const MessageValidator = require(__dirname + '/message/message-validator');
const Message = require(__dirname + '/message/message');
const TextMessage = require(__dirname + '/message/text-message');

const UserProfile = require(__dirname + '/user-profile');
const Response = require(__dirname + '/response');

const REQUEST_TYPE = {};
REQUEST_TYPE.SEND_MESSAGE = "send_message";
REQUEST_TYPE.POST_TO_PUBLIC_CHAT = "post_to_public_chat";

const REQUIRED_CONFIGURATION_FIELDS = ["authToken", "name", "avatar"];
const SUBSCRIBED_EVENTS = ["subscribed", "unsubscribed", "conversation_started", "message", "delivered", "seen"];
const API_URL = "https://chatapi.viber.com/pa";

function ViberBot(loggerOrConfiguration, configuration) {

	// backward compatibility: we are still allowing ctor as (logger, configuration);
	// newer should use (configuration) with logger property in it.
	let logger;
	if (!configuration) {
		// no logger, treat loggerOrConfiguration as configuration
		configuration = loggerOrConfiguration;
		logger = configuration.logger || NoopLogger;
	}
	else {
		logger = loggerOrConfiguration || NoopLogger;
	}

	if (!configuration) {
		throw new Error(`Invalid configuration`);
	}

	const missingFields = this._getMissingFieldsInConfiguration(configuration);
	if (!_.isEmpty(missingFields)) {
		throw new Error(`Invalid configuration ${configuration}. Missing fields: ${missingFields}`);
	}

	this.authToken = configuration.authToken;
	this.name = configuration.name;
	this.avatar = configuration.avatar;

	this._logger = logger;
	this._client = new ViberClient(this._logger, this, API_URL, configuration.registerToEvents || SUBSCRIBED_EVENTS);
	this._middleware = new Middleware(this._logger, new MessageValidator(this._logger, this.authToken));
	this._messageFactory = new MessageFactory(this._logger);
	this._regexMatcherRouter = new RegexMatcherRouter(this._logger);
	this._callbacks = { [EventConsts.CONVERSATION_STARTED]: []};

	this._registerStreamAndHandleEvents(this._middleware.getStream());
	this._setupTextMessageReceivedHandler();
	this._setupConversationStartedHandler();
}
util.inherits(ViberBot, EventEmitter);

ViberBot.prototype.getBotProfile = function() {
	return this._client.getAccountInfo();
};

ViberBot.prototype.getUserDetails = function(userProfile) {
	return this._client.getUserDetails(userProfile.id).then(response => Promise.resolve(response.user));
};

ViberBot.prototype.getOnlineStatus = function(viberUserIds) {
	return this._client.getOnlineStatus(viberUserIds);
};

ViberBot.prototype.setWebhook = function(url, isInline) {
	return this._client.setWebhook(url, isInline);
};

ViberBot.prototype.sendMessage = function(optionalUserProfile, messages, optionalTrackingData, optionalChatId) {
	return this._sendMessages(optionalUserProfile, messages, REQUEST_TYPE.SEND_MESSAGE, optionalTrackingData, optionalChatId);
};

ViberBot.prototype.postToPublicChat = function(senderProfile, messages) {
	return this._sendMessages(senderProfile, messages, REQUEST_TYPE.POST_TO_PUBLIC_CHAT);
};

ViberBot.prototype._sendMessages = function(userProfile, messages, requestType, optionalTrackingData, optionalChatId) {
	if (messages == null) return Promise.resolve();
	messages = _.isArray(messages) ? messages : [messages];

	const self = this;
	const lastMessage = messages.pop();
	const tokens = [];

	const resolveCallback = (response, message, resolve, reject) => {
		if (response.status != 0) reject(response);
		tokens.push(response.message_token);
		self.emit(EventConsts.MESSAGE_SENT, message, userProfile);
		resolve();
	};

	let promise = Promise.resolve();
	_.each(messages, message => {
		promise = promise.then(() => new Promise((resolve, reject) => {
			message.verifyMessage();
			resolve();
		}));

		promise = promise.then(() => new Promise((resolve, reject) => {
			if (requestType == REQUEST_TYPE.SEND_MESSAGE) return self._sendMessageFromClient(userProfile, message, null, null, optionalChatId, message.minApiVersion).then(response => resolveCallback(response, message, resolve, reject));
			if (requestType == REQUEST_TYPE.POST_TO_PUBLIC_CHAT) return self._sendMessageToPublicChat(userProfile, message);
			return reject(`internal error: unknown RequestType=${requestType}`);
		}));
	});

	return promise.then(() => new Promise((resolve, reject) => {
		if (requestType == REQUEST_TYPE.SEND_MESSAGE) {
				return self._sendMessageFromClient(userProfile, lastMessage, optionalTrackingData, lastMessage.keyboard, optionalChatId, lastMessage.minApiVersion)
											.then(response => resolveCallback(response, lastMessage, resolve, reject));
		}
		if (requestType == REQUEST_TYPE.POST_TO_PUBLIC_CHAT) {
			return self._sendMessageToPublicChat(userProfile, lastMessage, lastMessage.minApiVersion).then(response => resolveCallback(response, lastMessage, resolve, reject))
											.then(response => resolveCallback(response, lastMessage, resolve, reject));
		}
		return reject(`internal error: unknown RequestType=${requestType}`);
	}))
	.then(() => Promise.resolve(tokens));
};

ViberBot.prototype._sendMessageToPublicChat = function(senderProfile, message, optionalMinApiVersion) {
	const jsonMessage = message.toJson();
	return this._client.postToPublicChat(senderProfile, jsonMessage.type, jsonMessage, optionalMinApiVersion);
};

ViberBot.prototype.middleware = function() {
	return this._middleware.getIncoming();
};

ViberBot.prototype.onTextMessage = function(regex, callback) {
	this._regexMatcherRouter.newMatcher(regex, callback);
};

ViberBot.prototype.onError = function(callback) {
	this.on(EventConsts.ERROR, callback);
};

ViberBot.prototype.onConversationStarted = function(callback) {
	this._callbacks[EventConsts.CONVERSATION_STARTED].push(callback);
};

ViberBot.prototype.onSubscribe = function(callback) {
	this.on(EventConsts.SUBSCRIBED, callback);
};

ViberBot.prototype.onUnsubscribe = function(callback) {
	this.on(EventConsts.UNSUBSCRIBED, callback);
};

ViberBot.prototype._setupTextMessageReceivedHandler = function() {
	const self = this;
	this.on(EventConsts.MESSAGE_RECEIVED, (message, response, silent, replyType, chatId) => {
		if (!(message instanceof TextMessage)) return;

		const callback = this._regexMatcherRouter.tryGetCallback(message.text);
		if (!callback) {
			return self._logger.debug(`Could not find regex matcher for ${message.text}`);
		}
		callback(message, response);
	});
};

ViberBot.prototype._setupConversationStartedHandler = function() {
	const self = this;
	this.on(EventConsts.CONVERSATION_STARTED, (response, isSubscribed, context) => {
		_.each(self._callbacks[EventConsts.CONVERSATION_STARTED], callback => {
			callback(response.userProfile, isSubscribed, context, (responseMessage, optionalTrackingData) => {
				if (!responseMessage) return;
				if (!(responseMessage instanceof Message)) {
					throw new Error("Response from conversation started callback must be message or null");
				}

				const jsonMessage = responseMessage.toJson();
				if (responseMessage.keyboard) jsonMessage.keyboard = responseMessage.keyboard;
				if (responseMessage.trackingData) {
					jsonMessage["tracking_data"] = self._client._serializeTrackingData(optionalTrackingData || {});
				}

				self._logger.debug("Sending conversation started callback", jsonMessage);
				self._middleware.getStream().write(JSON.stringify(jsonMessage));
			});
		});
	});
};

ViberBot.prototype._getMissingFieldsInConfiguration = function(configuration) {
	return _.difference(REQUIRED_CONFIGURATION_FIELDS, Object.keys(configuration));
};

ViberBot.prototype._sendMessageFromClient = function(optionalUserProfile, message, optionalTrackingData, optionalKeyboard, optionalChatId, optionalMinApiVersion) {
	const jsonMessage = message.toJson();
	let receiver = null;
	if (optionalUserProfile) {
		receiver = optionalUserProfile.id;
	}
	return this._client.sendMessage(receiver, jsonMessage.type, jsonMessage, optionalTrackingData, optionalKeyboard, optionalChatId, optionalMinApiVersion);
};

ViberBot.prototype._registerStreamAndHandleEvents = function(stream) {
	const self = this;
	stream.on("data", data => {
		try {
			const parsedData = JSONBig.parse(data.toString());
			self._handleEventReceived(parsedData);
		}
		catch (err) {
			self._logger.error(err);
			self.emit(EventConsts.ERROR, err);
		}
	});
};

ViberBot.prototype._handleEventReceived = function(data) {
	const userProfile = this._getUserProfile(data);
	switch (data.event) {
		case EventConsts.MESSAGE_RECEIVED: {
			const message = this._messageFactory.createMessageFromJson(data);
			const response = new Response(this, userProfile, data.silent, data.reply_type, data.chat_id);
			this.emit(data.event, message, response, data.silent, data.reply_type, data.chat_id);
			break;
		}
		case EventConsts.SUBSCRIBED: {
			const response = new Response(this, userProfile);
			this.emit(data.event, response);
			break;
		}
		case EventConsts.CONVERSATION_STARTED: {
			const response = new Response(this, userProfile);
			this.emit(data.event, response, data.subscribed, data.context);
			break;
		}
		case EventConsts.UNSUBSCRIBED: {
			this.emit(data.event, data.user_id);
			break;
		}
		case EventConsts.FAILED: {
			this.emit(EventConsts.ERROR, data);
			break;
		}
		default: {
			this.emit(data.event, data);
			break;
		}
	}
};

ViberBot.prototype._getUserProfile = function(data) {
	if (_.has(data, "sender")) return UserProfile.fromJson(data.sender);
	else if (_.has(data, "user")) return UserProfile.fromJson(data.user);
	return null;
};

module.exports = ViberBot;
