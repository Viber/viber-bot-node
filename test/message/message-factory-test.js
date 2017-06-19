"use strict";

const TestEnvironmentConfiguration = require(__dirname + "/../util/test-environment-configuration");
const MessageFactory = require(__dirname + "/../../lib/message/message-factory");
const TextMessage = require(__dirname + "/../../lib/message/text-message");
const UrlMessage = require(__dirname + "/../../lib/message/url-message");
const ContactMessage = require(__dirname + '/../../lib/message/contact-message');
const FileMessage = require(__dirname + '/../../lib/message/file-message');
const LocationMessage = require(__dirname + '/../../lib/message/location-message');
const PictureMessage = require(__dirname + '/../../lib/message/picture-message');
const VideoMessage = require(__dirname + '/../../lib/message/video-message');
const StickerMessage = require(__dirname + '/../../lib/message/sticker-message');
const RichMediaMessage = require(__dirname + '/../../lib/message/rich-media-message');


exports.messageFactory = {
	setUp: callback => {
		this._messageFactory = new MessageFactory(TestEnvironmentConfiguration.MockLogger);
		callback();
	},

	testBuildInvalidJsonWithNull: test => {
		test.throws(() => new MessageFactory().createMessageFromJson(null));
		test.done();
	},

	testBuildInvalidMessageType: test => {
		const jsonMessage = { "type": "nonexisting" };
		test.throws(() => new MessageFactory().createMessageFromJson(jsonMessage));
		test.done();
	},

	testBuildTextMessageSanity: test => {
		const textMessage = {
			"event": "message",
			"timestamp": 1479039750092,
			"message_token": 4978563241957515056,
			"sender": {
				"id": "xWxFWBYHceVLi80yULnRkw==",
				"name": "Idan Harel",
				"avatar": "https://share.viber.com/download_photo?dlid=66adab37fe13aa4a731249d8a10a2fb8e5c339765661876e3d963083369a6a06%26fltp=jpg%26imsz=0000"
			},
			"message": { "text": "Hi", "type": "text", "tracking_data": "{}" }
		};

		const message = new MessageFactory().createMessageFromJson(textMessage);

		test.ok(message instanceof TextMessage, "message should be of type TextMessage");
		test.deepEqual(message.toJson(), { type: 'text', text: 'Hi' });
		test.done();
	},

	testBuildRichMediaMessageSanity: test => {
		const richMedia = {
			ButtonsGroupColumns: 6,
			ButtonsGroupRows: 5,
			BgColor: "#FFFFFF",
			Buttons: [{
				ActionBody: "https://shpp.io/118AY5234?r=true",
				ActionType: "open-url",
				BgMediaType: "picture",
				Image: "https://d2c9czzhg5xt5t.cloudfront.net/brand-logos/adidas-1.png",
				BgColor: "#000000",
				TextOpacity: 60,
				Rows: 4,
				Columns: 6
			}],
			DefaultHeight: true
		};

		const altText = "please upgrade now!";
		const richMediaMessage = {
			"event": "message",
			"timestamp": 1479039750092,
			"message_token": 4978563241957515056,
			"sender": {
				"id": "xWxFWBYHceVLi80yULnRkw==",
				"name": "Idan Harel",
				"avatar": "https://share.viber.com/download_photo?dlid=66adab37fe13aa4a731249d8a10a2fb8e5c339765661876e3d963083369a6a06%26fltp=jpg%26imsz=0000"
			},
			"message": {
				"rich_media": richMedia,
				"type": "rich_media",
				"tracking_data": "{}",
				"alt_text": altText
			}
		};

		const message = new MessageFactory().createMessageFromJson(richMediaMessage);

		test.ok(message instanceof RichMediaMessage, "message should be of type RichMediaMessage");
		test.deepEqual(message.toJson(), { type: "rich_media", rich_media: richMedia, "alt_text": altText, min_api_version: 2 }); // eslint-disable-line
		test.done();
	},

	testBuildUrlMessageSanity: test => {
		const urlMessage = {
			"event": "message",
			"timestamp": 1479039750092,
			"message_token": 4978563241957515056,
			"sender": {
				"id": "xWxFWBYHceVLi80yULnRkw==",
				"name": "Idan Harel",
				"avatar": "https://share.viber.com/download_photo?dlid=66adab37fe13aa4a731249d8a10a2fb8e5c339765661876e3d963083369a6a06%26fltp=jpg%26imsz=0000"
			},
			"message": { "media": "http://viber.com", "type": "url", "tracking_data": "{}" }
		};

		const message = new MessageFactory().createMessageFromJson(urlMessage);

		test.ok(message instanceof UrlMessage, "message should be of type UrlMessage");
		test.deepEqual(message.toJson(), { type: 'url', media: 'http://viber.com' });
		test.done();
	},

	testBuildContactMessageSanity: test => {
		const contactMessage = {
			"event": "message",
			"timestamp": 1479039750092,
			"message_token": 4978563241957515056,
			"sender": {
				"id": "xWxFWBYHceVLi80yULnRkw==",
				"name": "Idan Harel",
				"avatar": "https://share.viber.com/download_photo?dlid=66adab37fe13aa4a731249d8a10a2fb8e5c339765661876e3d963083369a6a06%26fltp=jpg%26imsz=0000"
			},
			"message": {
				"type": "contact",
				"contact": { "name": "idan", "phone_number": "97245611234" }
			}
		};

		const message = new MessageFactory().createMessageFromJson(contactMessage);

		test.ok(message instanceof ContactMessage, "message should be of type ContactMessage");
		test.deepEqual(message.toJson(), { type: 'contact', contact: { name: 'idan', "phone_number": '97245611234', 'avatar': null } });
		test.done();
	},

	testBuildFileMessageSanity: test => {
		const fileMessage = {
			"event": "message",
			"timestamp": 1479039750092,
			"message_token": 4978563241957515056,
			"sender": {
				"id": "xWxFWBYHceVLi80yULnRkw==",
				"name": "Idan Harel",
				"avatar": "https://share.viber.com/download_photo?dlid=66adab37fe13aa4a731249d8a10a2fb8e5c339765661876e3d963083369a6a06%26fltp=jpg%26imsz=0000"
			},
			"message": { "media": "http://viber.com", "type": "file", "size": 1234, "file_name": "test.com" }
		};

		const message = new MessageFactory().createMessageFromJson(fileMessage);

		test.ok(message instanceof FileMessage, "message should be of type FileMessage");
		test.deepEqual(message.toJson(), { type: 'file', media: 'http://viber.com', size: 1234, file_name: 'test.com' });
		test.done();
	},

	testBuildLocationMessageSanity: test => {
		const locationMessage = {
			"event": "message",
			"timestamp": 1479039750092,
			"message_token": 4978563241957515056,
			"sender": {
				"id": "xWxFWBYHceVLi80yULnRkw==",
				"name": "Idan Harel",
				"avatar": "https://share.viber.com/download_photo?dlid=66adab37fe13aa4a731249d8a10a2fb8e5c339765661876e3d963083369a6a06%26fltp=jpg%26imsz=0000"
			},
			"message": {
				"type": "location",
				"location": { "lat": 1234, "lon": 4312 }
			}
		};

		const message = new MessageFactory().createMessageFromJson(locationMessage);

		test.ok(message instanceof LocationMessage, "message should be of type LocationMessage");
		test.deepEqual(message.toJson(), {
			type: 'location',
			location: { lat: 1234, lon: 4312 }
		});
		test.done();
	},

	testBuildPictureMessageSanity: test => {
		const pictureMessage = {
			"event": "message",
			"timestamp": 1479039750092,
			"message_token": 4978563241957515056,
			"sender": {
				"id": "xWxFWBYHceVLi80yULnRkw==",
				"name": "Idan Harel",
				"avatar": "https://share.viber.com/download_photo?dlid=66adab37fe13aa4a731249d8a10a2fb8e5c339765661876e3d963083369a6a06%26fltp=jpg%26imsz=0000"
			},
			"message": { "type": "picture", "text": "hello", "media": "http://viber.com", "thumbnail": "http://viber.com/thumb.png" }
		};

		const message = new MessageFactory().createMessageFromJson(pictureMessage);

		test.ok(message instanceof PictureMessage, "message should be of type PictureMessage");
		test.deepEqual(message.toJson(), { type: 'picture', text: 'hello', media: 'http://viber.com', thumbnail: 'http://viber.com/thumb.png' });
		test.done();
	},

	testBuildVideoMessageSanity: test => {
		const videoMessage = {
			"event": "message",
			"timestamp": 1479039750092,
			"message_token": 4978563241957515056,
			"sender": {
				"id": "xWxFWBYHceVLi80yULnRkw==",
				"name": "Idan Harel",
				"avatar": "https://share.viber.com/download_photo?dlid=66adab37fe13aa4a731249d8a10a2fb8e5c339765661876e3d963083369a6a06%26fltp=jpg%26imsz=0000"
			},
			"message": { "type": "video", "media": "http://viber.com", "thumbnail": "http://viber.com/thumb.png", "size": 1234, "duration": 123 }
		};

		const message = new MessageFactory().createMessageFromJson(videoMessage);

		test.ok(message instanceof VideoMessage, "message should be of type VideoMessage");
		test.deepEqual(message.toJson(), { type: 'video', media: 'http://viber.com', 'text': null, thumbnail: 'http://viber.com/thumb.png', size: 1234, duration: 123 });
		test.done();
	},

	testBuildStickerMessageSanity: test => {
		const stickerMessage = {
			"event": "message",
			"timestamp": 1479039750092,
			"message_token": 4978563241957515056,
			"sender": {
				"id": "xWxFWBYHceVLi80yULnRkw==",
				"name": "Idan Harel",
				"avatar": "https://share.viber.com/download_photo?dlid=66adab37fe13aa4a731249d8a10a2fb8e5c339765661876e3d963083369a6a06%26fltp=jpg%26imsz=0000"
			},
			"message": { "type": "sticker", "sticker_id": 5536 }
		};

		const message = new MessageFactory().createMessageFromJson(stickerMessage);

		test.ok(message instanceof StickerMessage, "message should be of type StickerMessage");
		test.deepEqual(message.toJson(), { type: 'sticker', sticker_id: 5536 }); // eslint-disable-line
		test.done();
	}
};
