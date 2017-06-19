"use strict";

const PictureMessage = require(__dirname + "/../../lib/message/picture-message");

exports.testBuildPictureMessageSanity = test => {
	const text = "hello";
	const url = "http://viber.com/idan";
	const thumbnail = "http://viber.com/thumb.png";

	const message = new PictureMessage(url, text, thumbnail);
	const messageBody = { "type": "picture", "text": text, "media": url, "thumbnail": thumbnail };

	test.deepEqual(message.toJson(), messageBody);
	test.ok(!message.keyboard);
	test.done();
};

exports.testBuildPictureMessageWithoutOptionalParams = test => {
	const text = "hello";
	const url = "http://viber.com/idan";

	const message = new PictureMessage(url, text);
	const messageBody = { "type": "picture", "text": text, "media": url, "thumbnail": null };

	test.deepEqual(message.toJson(), messageBody);
	test.ok(!message.keyboard);
	test.done();
};

exports.testBuildPictureMessageWithKeyboard = test => {
	const keyboard = { foo: "bar" };
	const message = new PictureMessage("hi", "viber.com", "thumb.png", keyboard);

	test.deepEqual(message.keyboard, keyboard);
	test.done();
};
