"use strict";

function RegexMatcherRouter(logger) {
	this._logger = logger;
	this._textRegexpCallbacks = [];
}

RegexMatcherRouter.prototype.newMatcher = function(regexp, callback) {
	this._textRegexpCallbacks.push({ regexp, callback });
};

RegexMatcherRouter.prototype.tryGetCallback = function(text) {
	const self = this;
	const match = this._textRegexpCallbacks.find(reg => {
		self._logger.debug(`Matching ${text} with ${reg.regexp}`);
		const result = reg.regexp.exec(text);

		if (result) {
			self._logger.debug(`Matches ${text} = ${reg.regexp}`);
			return true;
		}
	});

	return match ? match.callback : null;
};

module.exports = RegexMatcherRouter;
