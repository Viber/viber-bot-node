"use strict";

const TestEnvironmentConfiguration = require(__dirname + "/util/test-environment-configuration");
const ViberBot = require(__dirname + "/../lib/viber-bot");

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
	}
};