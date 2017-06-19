"use strict";

const FileMessage = require(__dirname + "/../../lib/message/file-message");

exports.testBuildFileMessageSanity = test => {
	const url = "http://idan.txt";
	const size = 1234;
	const filename = "idan.txt";
	const message = new FileMessage(url, size, filename);
	const messageBody = { "type": "file", "media": url, "size": size, "file_name": filename };

	test.deepEqual(message.toJson(), messageBody);
	test.ok(!message.keyboard);
	test.done();
};

exports.testBuildFileMessageWithKeyboard = test => {
	const keyboard = { foo: "bar" };
	const message = new FileMessage("http://idan.txt", 123, "idan.txt", keyboard);

	test.deepEqual(message.keyboard, keyboard);
	test.done();
};
