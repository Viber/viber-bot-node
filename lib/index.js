"use strict";

module.exports = {
	Bot: require(__dirname + '/viber-bot'),
	Events: require(__dirname + '/event-consts'),
	UserProfile: require(__dirname + '/user-profile'),
	Message: {
		Text: require(__dirname + '/message/text-message'),
		Url: require(__dirname + '/message/url-message'),
		Contact: require(__dirname + '/message/contact-message'),
		File: require(__dirname + '/message/file-message'),
		Location: require(__dirname + '/message/location-message'),
		Picture: require(__dirname + '/message/picture-message'),
		Video: require(__dirname + '/message/video-message'),
		Sticker: require(__dirname + '/message/sticker-message'),
		RichMedia: require(__dirname + '/message/rich-media-message'),
		Keyboard: require(__dirname + '/message/keyboard-message')
	}
};
