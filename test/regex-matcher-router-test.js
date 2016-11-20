"use strict";

const TestEnvironmentConfiguration = require(__dirname + "/util/test-environment-configuration");
const RegexMatcherRouter = require(__dirname + "/../lib/regex-matcher-router");

exports.testRegexMatcher = {
	setUp: callback => {
		this._regexMatcherRouter = new RegexMatcherRouter(TestEnvironmentConfiguration.MockLogger);
		callback();
	},

	sanity: test => {
		this._regexMatcherRouter.newMatcher(/^hi|hello|bonjour$/i, () => test.done());
		const callback = this._regexMatcherRouter.tryGetCallback("hi");

		if (!callback) test.fail();
		else callback();
	},

	shouldNotMatch: test => {
		this._regexMatcherRouter.newMatcher(/^hi|hello|bonjour$/i, () => test.fail());
		const callback = this._regexMatcherRouter.tryGetCallback("blablabla");
		if (!callback) test.done();
	},

	shouldMatchSentence: test => {
		this._regexMatcherRouter.newMatcher(/hi|hello|bonjour/i, () => test.done());
		const callback = this._regexMatcherRouter.tryGetCallback("wow hi this is foo bar really nice");
		if (!callback) test.fail();
		else callback();
	}
};