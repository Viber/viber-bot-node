"use strict";

const VideoMessage = require(__dirname + "/../../lib/message/video-message");

exports.testBuildVideoMessageSanity = test => {
	const url = "http://viber.com/idan";
	const size = 1000;
	const thumbnail = "http://viber.com/thumb.png";
	const duration = 123;

	const message = new VideoMessage(url, size, undefined, thumbnail, duration);
	const messageBody = {
		"type": "video",
		"media": url,
		"text": null,
		"size": size,
		"thumbnail": thumbnail,
		"duration": duration
	};

	test.deepEqual(message.toJson(), messageBody);
	test.ok(!message.keyboard);
	test.done();
};

exports.testBuildVideoMessageWithoutOptionalParams = test => {
	const url = "http://viber.com/idan";
	const size = 1000;

	const message = new VideoMessage(url, size);
	const messageBody = { "type": "video", "media": url, "size": size, "thumbnail": null, text: null, "duration": null };

	test.deepEqual(message.toJson(), messageBody);
	test.ok(!message.keyboard);
	test.done();
};

exports.testBuildVideoMessageWithKeyboard = test => {
	const keyboard = { foo: "bar" };
	const message = new VideoMessage("http://viber.com", 1000, null, "http://viber.com/thumb.png", 123, keyboard);

	test.deepEqual(message.keyboard, keyboard);
	test.done();
};
