"use strict";

const ContactMessage = require(__dirname + "/../../lib/message/contact-message");

exports.testBuildContractMessageSanity = test => {
	const contactName = "idan";
	const contactPhoneNumber = "+972541234567";
	const message = new ContactMessage(contactName, contactPhoneNumber);
	const messageBody = {
		"type": "contact",
		"contact": { "name": contactName, "phone_number": contactPhoneNumber }
	};

	test.deepEqual(message.toJson(), messageBody);
	test.ok(!message.keyboard);
	test.done();
};

exports.testBuildContactMessageWithKeyboard = test => {
	const keyboard = { foo: "bar" };
	const message = new ContactMessage("idan", "000", keyboard);

	test.deepEqual(message.keyboard, keyboard);
	test.done();
};

exports.testBuildNullContactMessage = test => {
	test.throws(() => new ContactMessage(null));
	test.done();
};
