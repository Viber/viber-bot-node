"use strict";

const TextMessage = require(__dirname + "/../../lib/message/text-message");

exports.testBuildTextMessageSanity = test => {
	const text = "hello";
	const message = new TextMessage(text);
	const messageBody = { "type": "text", "text": text };

	test.deepEqual(message.toJson(), messageBody);
	test.ok(!message.keyboard);
	test.done();
};

exports.testBuildTextMessageWithKeyboard = test => {
	const keyboard = { foo: "bar" };
	const message = new TextMessage("foo", keyboard);

	test.deepEqual(message.keyboard, keyboard);
	test.done();
};
