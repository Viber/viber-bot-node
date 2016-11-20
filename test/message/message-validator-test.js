"use strict";

const TestEnvironmentConfiguration = require(__dirname + "/../util/test-environment-configuration");
const MessageValidator = require(__dirname + "/../../lib/message/message-validator");

const AUTH_TOKEN = '44dafb7e0f40021e-61a47a1e6778d187-f2c5a676a07050b3';
const VALID_SIGNATURE = 'd21b343448c8aee33b8e93768ef6ceb64a6ba6163099973a2b8bd028fea510ef';
const INVALID_SIGNATURE = 'abcd';
const SERVER_MESSAGE = "{\"event\":\"webhook\",\"timestamp\":4977069964384421269,\"message_token\":1478683725125}";

exports.testMessageValidator = {
	setUp: callback => {
		this._messageValidator = new MessageValidator(TestEnvironmentConfiguration.MockLogger, AUTH_TOKEN);
		callback();
	},

	sanity: test => {
		test.ok(this._messageValidator.validateMessage(VALID_SIGNATURE, SERVER_MESSAGE), "signature is valid");
		test.done();
	},

	invalidData: test => {
		test.ok(!this._messageValidator.validateMessage(INVALID_SIGNATURE, "{}"), "data/signature should mismatch");
		test.done();
	},

	nullData: test => {
		test.throws(() => this._messageValidator.validateMessage(null, null));
		test.done();
	}
};