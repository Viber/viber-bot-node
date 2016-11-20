"use strict";

process.env["NODE_CONFIG_DIR"] = __dirname + '/../conf';

module.exports = {
	MockLogger: require(__dirname + "/mock-logger")
};