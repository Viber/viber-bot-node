"use strict";

const _ = require('underscore');

const ViberClient = require(__dirname + '/../lib/viber-client');
const TestEnvironmentConfiguration = require(__dirname + "/util/test-environment-configuration");
const ViberBot = require(__dirname + "/../lib/viber-bot");
const express = require('express');
const bodyParser = require('body-parser');
const UserProfile = require(__dirname + '/../lib/user-profile');

const SAMPLE_BOT = new ViberBot(TestEnvironmentConfiguration.MockLogger, {
	authToken: "123AB",
	name: "Test",
	avatar: "http://avatar.com/image.jpg"
});

function startServer(port, requestHandler, onFinish) {
	const app = express();
	app.use(bodyParser.json());
	app.post('/*', requestHandler);
	const server = app.listen(port, () => {
		return onFinish(null, server);
	});
}

module.exports = {
	testSendRequestHandlesOnError: test => {
		test.expect(2);

		function requestHandler(req, res) {
			return res.status(500).send({ error: 'something blew up' });
		}

		return startServer(0, requestHandler, function(err, server) {
			test.ok(!err);

			const apiUrl = "http://127.0.0.1:" + server.address().port;
			const client = new ViberClient(TestEnvironmentConfiguration.MockLogger, SAMPLE_BOT, apiUrl, []);

			client.getAccountInfo().then(function(data) {
				test.ok(false, "did not receive an error");
				server.close();
				test.done();
			}, function(err) {
				test.ok(err);
				server.close();
				test.done();
			});
		});
	},

	testSendMessageSendsAllParameters: test => {
		test.expect(7);

		const receiver = "to viber user";
		const messageType = "text";
		const messageData = {
			text: "Hi! how are you?"
		};
		const trackingData = { value: "sent 1 message" };
		const keyboard = { button: { bgColor: "#FFFFFF" }};
		const chatId = "sample chatId";
		const minApiVersion = 2;


		function requestHandler(req, res) {
			test.equals(req.body.receiver, receiver);
			test.equals(req.body.tracking_data, JSON.stringify(trackingData));
			test.equals(JSON.stringify(req.body.keyboard), JSON.stringify(keyboard));
			test.equals(req.body.chat_id, chatId);
			test.equals(req.body.min_api_version, minApiVersion);
			test.equals(req.body.text, messageData.text);
			return res.status(200).send({ status: 0 });
		}

		return startServer(0, requestHandler, function(err, server) {
			test.ok(!err);

			const apiUrl = "http://127.0.0.1:" + server.address().port;
			const client = new ViberClient(TestEnvironmentConfiguration.MockLogger, SAMPLE_BOT, apiUrl, []);

			client.sendMessage(receiver, messageType, messageData, trackingData, keyboard, chatId, minApiVersion).then(function(data) {
				server.close();
				test.done();
			}, function(err) {
				test.ok(err);
				server.close();
				test.done();
			});
		});
	},

	testPostToPublicChatSendsAllParameters: test => {
		test.expect(6);

		const sender = new UserProfile('sender id', 'sender name', 'avatar url');
		const messageType = "text";
		const messageData = {
			text: "Hi! how are you?"
		};
		const minApiVersion = 2;


		function requestHandler(req, res) {
			test.equals(req.body.from, sender.id);
			test.equals(req.body.sender.name, sender.name);
			test.equals(req.body.sender.avatar, sender.avatar);
			test.equals(req.body.min_api_version, minApiVersion);
			test.equals(req.body.text, messageData.text);
			return res.status(200).send({ status: 0 });
		}

		return startServer(0, requestHandler, function(err, server) {
			test.ok(!err);

			const apiUrl = "http://127.0.0.1:" + server.address().port;
			const client = new ViberClient(TestEnvironmentConfiguration.MockLogger, SAMPLE_BOT, apiUrl, []);

			client.postToPublicChat(sender, messageType, messageData, minApiVersion).then(function(data) {
				server.close();
				test.done();
			}, function(err) {
				test.ok(err);
				server.close();
				test.done();
			});
		});
	},

	testSendMessageWithoutReceiver: test => {
		test.expect(7);

		const receiver = null;
		const messageType = "text";
		const messageData = {
			text: "Hi! how are you?"
		};
		const trackingData = { value: "sent 1 message" };
		const keyboard = { button: { bgColor: "#FFFFFF" }};
		const chatId = "sample chatId";
		const minApiVersion = 2;


		function requestHandler(req, res) {
			test.ok(_.isUndefined(req.body.receiver));
			test.equals(req.body.tracking_data, JSON.stringify(trackingData));
			test.equals(JSON.stringify(req.body.keyboard), JSON.stringify(keyboard));
			test.equals(req.body.chat_id, chatId);
			test.equals(req.body.min_api_version, minApiVersion);
			test.equals(req.body.text, messageData.text);
			return res.status(200).send({ status: 0 });
		}

		return startServer(0, requestHandler, function(err, server) {
			test.ok(!err);

			const apiUrl = "http://127.0.0.1:" + server.address().port;
			const client = new ViberClient(TestEnvironmentConfiguration.MockLogger, SAMPLE_BOT, apiUrl, []);

			client.sendMessage(receiver, messageType, messageData, trackingData, keyboard, chatId, minApiVersion).then(function(data) {
				server.close();
				test.done();
			}, function(err) {
				test.ok(err);
				server.close();
				test.done();
			});
		});
	}
};
