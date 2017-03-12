"use strict";

const TestEnvironmentConfiguration = require(__dirname + "/util/test-environment-configuration");
const ViberBot = require(__dirname + "/../lib/viber-bot");
const EventConsts = require(__dirname + "/../lib/event-consts");


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
			name: "Test",
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
