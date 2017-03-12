"use strict";

const _ = require('underscore');

const TextMessage = require(__dirname + '/text-message');
const UrlMessage = require(__dirname + '/url-message');
const ContactMessage = require(__dirname + '/contact-message');
const FileMessage = require(__dirname + '/file-message');
const LocationMessage = require(__dirname + '/location-message');
const PictureMessage = require(__dirname + '/picture-message');
const VideoMessage = require(__dirname + '/video-message');
const StickerMessage = require(__dirname + '/sticker-message');
const RichMediaMessage = require(__dirname + '/rich-media-message');

const SUPPORTED_MESSAGE_TYPES = [TextMessage, UrlMessage, ContactMessage,
	FileMessage, LocationMessage, PictureMessage, VideoMessage, StickerMessage,
	RichMediaMessage];

function MessageFactory(logger) {
	const self = this;

	this._logger = logger;
	this._mapping = {};

	_.each(SUPPORTED_MESSAGE_TYPES, messageType => self._mapping[messageType.getType()] = messageType);
}

MessageFactory.prototype.createMessageFromJson = function(json) {
	let messageType = json.message.type.toLowerCase();
	if (!_.has(this._mapping, messageType)) {
		this._logger.debug(`Could not build message from type ${messageType}. No mapping found`);
		return;
	}
	return this._mapping[messageType].fromJson(json.message, json.timestamp, json.message_token);
};

module.exports = MessageFactory;
