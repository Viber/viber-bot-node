"use strict";

const KeyboardMessage = require(__dirname + "/../../lib/message/keyboard-message");

const SAMPLE_KEYBOARD = {
	"Type": "keyboard",
	"Revision": 1,
	"Buttons": [
		{
			"Columns": 3,
			"Rows": 2,
			"BgColor": "#e6f5ff",
			"BgMedia": "http://www.jqueryscript.net/images/Simplest-Responsive-jQuery-Image-Lightbox-Plugin-simple-lightbox.jpg",
			"BgMediaType": "picture",
			"BgLoop": true,
			"ActionType": "reply",
			"ActionBody": "whatwhatwhatwhatwhatwhat"
		}
	]
};

exports.testBuildMessageSanity = test => {
	const message = new KeyboardMessage(SAMPLE_KEYBOARD);
	const messageBody = {};

	test.deepEqual(message.toJson(), messageBody);
	test.ok(message.keyboard);
	test.deepEqual(message.keyboard, SAMPLE_KEYBOARD);
	test.done();
};
