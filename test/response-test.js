"use strict";

const Response = require(__dirname + '/../lib/response.js');

const sampleUserProfile = "userProfile";
const sampleSilent = true;
const sampleChatId = "sample chatId";
const sampleMessages = "a message list";
const sampleTrackingData = "user tracking data";

exports.sendingResponse = {
	replyTypeMessage: test => {
		test.expect(4);
		const bot = {
			sendMessage: function(userProfile, messages, trackingData, chatId) {
				test.ok(!userProfile);
				test.equals(messages, sampleMessages);
				test.equals(trackingData, sampleTrackingData);
				test.equals(chatId, sampleChatId);
				test.done();
			}
		};

		const replyType = "message";
		const response = new Response(bot, sampleUserProfile, sampleSilent, replyType, sampleChatId);
		response.send(sampleMessages, sampleTrackingData);
	},
	replyTypeQuery: test => {
		test.expect(4);
		const bot = {
			sendMessage: function(userProfile, messages, trackingData, chatId) {
				test.equals(userProfile, sampleUserProfile);
				test.equals(messages, sampleMessages);
				test.equals(trackingData, sampleTrackingData);
				test.equals(chatId, sampleChatId);
				test.done();
			}
		};

		const replyType = "query";
		const response = new Response(bot, sampleUserProfile, sampleSilent, replyType, sampleChatId);
		response.send(sampleMessages, sampleTrackingData);
	},
	noReplyType: test => {
		test.expect(4);
		const bot = {
			sendMessage: function(userProfile, messages, trackingData, chatId) {
				test.equals(userProfile, sampleUserProfile);
				test.equals(messages, sampleMessages);
				test.equals(trackingData, sampleTrackingData);
				test.ok(!chatId);
				test.done();
			}
		};

		const replyType = undefined;
		const response = new Response(bot, sampleUserProfile, sampleSilent, replyType, sampleChatId);
		response.send(sampleMessages, sampleTrackingData);
	}
};
