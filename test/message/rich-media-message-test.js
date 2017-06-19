"use strict";

const RichMediaMessage = require(__dirname + "/../../lib/message/rich-media-message");

const SAMPLE_RICH_MEDIA = {
	"ButtonsGroupColumns": 6,
	"ButtonsGroupRows": 5,
	"BgColor": "#FFFFFF",
	"Buttons": [{
		"ActionBody": "https://shpp.io/118AY5234?r=true",
		"ActionType": "open-url",
		"BgMediaType": "picture",
		"Image": "https://d2c9czzhg5xt5t.cloudfront.net/brand-logos/adidas-1.png",
		"BgColor": "#000000",
		"TextOpacity": 60,
		"Rows": 4,
		"Columns": 6
	}],
	"DefaultHeight": true
};

exports.testBuildRichMediaMessageSanity = test => {
	const message = new RichMediaMessage(SAMPLE_RICH_MEDIA);
	const messageBody = { "type": "rich_media", "rich_media": SAMPLE_RICH_MEDIA, "alt_text": null, "min_api_version": 2 };

	test.deepEqual(message.toJson(), messageBody);
	test.ok(!message.keyboard);
	test.done();
};

exports.testBuildRichMediaMessageWithAltText = test => {
	const altText = "please upgrade to see message content!";
	const message = new RichMediaMessage(SAMPLE_RICH_MEDIA, null, null, null, null, altText);
	const messageBody = { "type": "rich_media", "rich_media": SAMPLE_RICH_MEDIA, "alt_text": altText, "min_api_version": 2 };

	test.deepEqual(message.toJson(), messageBody);
	test.ok(!message.keyboard);
	test.done();
};

exports.testBuildRichMediaMessageWithKeyboard = test => {
	const keyboard = { foo: "bar" };
	const message = new RichMediaMessage(SAMPLE_RICH_MEDIA, keyboard);

	test.deepEqual(message.keyboard, keyboard);
	test.done();
};
