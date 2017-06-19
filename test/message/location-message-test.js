"use strict";

const LocationMessage = require(__dirname + "/../../lib/message/location-message");

exports.testBuildLocationMessageSanity = test => {
	const lat = 123;
	const lon = 231;

	const message = new LocationMessage(lat, lon);
	const messageBody = {
		"type": "location",
		"location": { "lat": lat, "lon": lon }
	};

	test.deepEqual(message.toJson(), messageBody);
	test.ok(!message.keyboard);
	test.done();
};

exports.testBuildLocationMessageWithKeyboard = test => {
	const keyboard = { foo: "bar" };
	const message = new LocationMessage(1234, 1234, keyboard);

	test.deepEqual(message.keyboard, keyboard);
	test.done();
};
