"use strict";

const REPLY_TYPE = {};
REPLY_TYPE.MESSAGE = 'message';
REPLY_TYPE.QUERY = 'query';

function Response(bot, userProfile, silent, replyType, chatId) {
	this._bot = bot;
	this.userProfile = userProfile;
	this.silent = silent;
	this.replyType = replyType;
	this.chatId = chatId;
	Object.freeze(this);
}

Response.prototype.send = function(messages, optionalTrackingData) {
	if (this.replyType == REPLY_TYPE.MESSAGE) return this._bot.sendMessage(null, messages, optionalTrackingData, this.chatId);
	if (this.replyType == REPLY_TYPE.QUERY) return this._bot.sendMessage(this.userProfile, messages, optionalTrackingData, this.chatId);
	return this._bot.sendMessage(this.userProfile, messages, optionalTrackingData);
};

module.exports = Response;
