"use strict";

const TestEnvironmentConfiguration = require(__dirname + "/util/test-environment-configuration");
const ViberBot = require(__dirname + "/../lib/viber-bot");
const EventConsts = require(__dirname + "/../lib/event-consts");
const TextMessage = require(__dirname + "/../lib/message/text-message");
const UserProfile = require(__dirname + "/../lib/user-profile");


exports.creatingBotObject = {
	createBotWithoutMissingFields: test => {
		new ViberBot(TestEnvironmentConfiguration.MockLogger, {
			authToken: "123AB",
			name: "Test",
			avatar: "http://avatar.com/image.jpg"
		});
		test.done();
	},

	createBotWithLoggerAsOption: test => {
		new ViberBot({
			logger: TestEnvironmentConfiguration.MockLogger,
			authToken: "123AB",
			name: "Test",
			avatar: "http://avatar.com/image.jpg"
		});
		test.done();
	},

	createBotWithMissingAuthTokenField: test => {
		test.throws(() => new ViberBot(TestEnvironmentConfiguration.MockLogger, {
			name: "Test",
			avatar: "http://avatar.com/image.jpg"
		}));
		test.done();
	},

	createBotWithMissingNameField: test => {
		test.throws(() => new ViberBot(TestEnvironmentConfiguration.MockLogger, {
			authToken: "123AB",
			avatar: "http://avatar.com/image.jpg"
		}));
		test.done();
	},

	createBotWithMissingAvatarField: test => {
		test.throws(() => new ViberBot(TestEnvironmentConfiguration.MockLogger, {
			authToken: "123AB",
			name: "Test"
		}));
		test.done();
	},

	createBotWithoutConfiguration: test => {
		test.throws(() => new ViberBot(TestEnvironmentConfiguration.MockLogger, {}));
		test.done();
	},

	conversationStatedGettingContext: test => {
		test.expect(1);
		const bot = new ViberBot(TestEnvironmentConfiguration.MockLogger, {
			authToken: "123AB",
			avatar: "http://avatar.com/image.jpg",
			name: "myTestBot"
		});
		const sampleContext = "sample_context_data";

		bot.onConversationStarted((response, isSubscribed, context) => {
			test.equals(context, sampleContext);
			test.done();
		});

		bot._handleEventReceived({
			event: EventConsts.CONVERSATION_STARTED,
			user: {
				id: "01234567890A=",
				name: "John McClane",
				avatar: "http://avatar.example.com",
				country: "UK",
				language: "en",
				api_version: 1 // eslint-disable-line
			},
			subscribed: false,
			context: sampleContext
		});
	}
};

exports.sendMessage = {
	testSendMessagesSendsAllParams: test => {
		test.expect(7);
		const bot = new ViberBot(TestEnvironmentConfiguration.MockLogger, {
			authToken: "123AB",
			avatar: "http://avatar.com/image.jpg",
			name: "myTestBot"
		});

		const receiver = "to viber user";
		const sampleUserProfile = { id: receiver };
		const text = "sample message";
		const sampleTrackingData = { value: "sent 1 message" };
		const sampleKeyboard = { button: { bgColor: "#FFFFFF" }};
		const sampleChatId = "sample chatId";
		const sampleMinApiVersion = 2;
		const sampleMessage = new TextMessage(text, sampleKeyboard, null, null, null, sampleMinApiVersion);

		bot._client = {
			sendMessage: function(receiverId, messageType, message, trackingData, keyboard, chatId, minApiVersion) {
				test.equals(receiverId, receiver);
				test.equals(messageType, TextMessage.getType());
				test.equals(trackingData, sampleTrackingData);
				test.equals(keyboard, sampleKeyboard);
				test.equals(chatId, sampleChatId);
				test.equals(minApiVersion, sampleMinApiVersion);
				test.equals(message.text, sampleMessage.text);
				test.done();
			}
		};

		bot.sendMessage(sampleUserProfile, sampleMessage, sampleTrackingData, sampleChatId);
	},

	testSendMultipleMessages: test => {
		test.expect(11);
		const bot = new ViberBot(TestEnvironmentConfiguration.MockLogger, {
			authToken: "123AB",
			avatar: "http://avatar.com/image.jpg",
			name: "myTestBot"
		});

		const receiver = "to viber user 2";
		const sampleUserProfile = { id: receiver };
		const text = "sample message 2";
		const sampleChatId = "sample chatId";
		const sampleMinApiVersion = 2;
		const sampleMessage = new TextMessage(text, null, null, null, null, sampleMinApiVersion);

		bot._client = {
			sendMessage: function(receiverId, messageType, message, trackingData, keyboard, chatId, minApiVersion) {
				test.equals(receiverId, receiver);
				test.equals(messageType, TextMessage.getType());
				test.equals(chatId, sampleChatId);
				test.equals(minApiVersion, sampleMinApiVersion);
				test.equals(message.text, sampleMessage.text);
				return Promise.resolve({ status: 0, message_token: "token" }); // eslint-disable-line
			}
		};

		bot.sendMessage(sampleUserProfile, [sampleMessage, sampleMessage], null, sampleChatId)
			.then(resp => {
				test.equals(resp.length, 2);
				test.done();
			}).catch(err => test.done(err));
	}
};

exports.postToPublicChat = {
	testPostToPublicChatSendsAllParams: test => {
		test.expect(4);
		const bot = new ViberBot(TestEnvironmentConfiguration.MockLogger, {
			authToken: "123AB",
			avatar: "http://avatar.com/image.jpg",
			name: "myTestBot"
		});

		const sender = new UserProfile('sender id', 'sender name', 'avatar url');
		const minApiVersion = 2;
		const message = new TextMessage("my text message", null, null, null, null, minApiVersion);

		bot._client = {
			postToPublicChat: function(senderProfile, messageType, messageData, optionalMinApiVersion) {
				test.equals(senderProfile, sender);
				test.equals(messageType, TextMessage.getType());
				test.equals(messageData.text, message.text);
				test.equals(optionalMinApiVersion, minApiVersion);
				test.done();
			}
		};

		bot.postToPublicChat(sender, message);
	}
};

exports.eventHandling = {
	testBigIntTokenInEvent: test => {
		test.expect(1);
		const bot = new ViberBot(TestEnvironmentConfiguration.MockLogger, {
			authToken: "123AB",
			avatar: "http://avatar.com/image.jpg",
			name: "myTestBot"
		});

		bot.on("webhook", data => {
			test.equals("5058590812907389764", data.message_token);
			test.done();
		});

		const webhookEvent = '{ "event": "webhook", "message_token": 5058590812907389764 }';

		const mockedStream = new require('stream').Readable();
		mockedStream._read = function(size) {};

		bot._registerStreamAndHandleEvents(mockedStream);

		mockedStream.emit('data', webhookEvent);
		mockedStream.emit('end');
	}
};
