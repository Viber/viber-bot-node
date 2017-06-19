"use strict";

const UrlMessage = require(__dirname + "/../../lib/message/url-message");

exports.testBuildUrlMessageSanity = test => {
	const url = "http://viber.com";
	const message = new UrlMessage(url);
	const messageBody = { "type": "url", "media": url };

	test.deepEqual(message.toJson(), messageBody);
	test.ok(!message.keyboard);
	test.done();
};

exports.testBuildUrlMessageTestEncoding = test => {
	const url = "http://viber.com/bla?what is real";
	const message = new UrlMessage(url);
	const messageBody = { "type": "url", "media": encodeURI(url) };

	test.deepEqual(message.toJson(), messageBody);
	test.ok(!message.keyboard);
	test.done();
};

exports.testBuildUrlMessageWithKeyboard = test => {
	const keyboard = { foo: "bar" };
	const message = new UrlMessage("http://viber.com", keyboard);

	test.deepEqual(message.keyboard, keyboard);
	test.done();
};
