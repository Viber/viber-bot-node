"use strict";

const util = require('util');
const Message = require(__dirname + '/message');
const REQUIRED_ARGUMENTS = ["contactName", "contactPhoneNumber"];

function ContactMessage(contactName, contactPhoneNumber, optionalAvatar, optionalKeyboard, optionalTrackingData, timestamp, token, minApiVersion) {
	this.contactName = contactName;
	this.contactPhoneNumber = contactPhoneNumber;
	this.contactAvatar = optionalAvatar || null;

	ContactMessage.super_.apply(this, [REQUIRED_ARGUMENTS, optionalKeyboard, optionalTrackingData, timestamp, token, minApiVersion]);
}
util.inherits(ContactMessage, Message);

ContactMessage.fromJson = function(jsonMessage, timestamp, token) {
	return new ContactMessage(jsonMessage.contact.name, jsonMessage.contact.phone_number,
		null, jsonMessage.tracking_data, timestamp, token);
};

ContactMessage.getType = function() {
	return "contact";
};

ContactMessage.prototype.toJson = function() {
	return {
		"type": ContactMessage.getType(),
		"contact": {
			"name": this.contactName,
			"phone_number": this.contactPhoneNumber,
			"avatar": this.contactAvatar
		}
	};
};

module.exports = ContactMessage;
