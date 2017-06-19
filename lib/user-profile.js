"use strict";

function UserProfile(id, name, avatar, country, language, apiVersion) {
	this.id = id;
	this.name = name;
	this.avatar = avatar || null;
	this.country = country || null;
	this.language = language || null;
	this.apiVersion = apiVersion || null;
	Object.freeze(this);
}

UserProfile.fromJson = function(jsonSender) {
	if (!jsonSender) throw new Error("Json data must be non-null");
	return new UserProfile(jsonSender.id, jsonSender.name, jsonSender.avatar, jsonSender.country, jsonSender.language, jsonSender.api_version);
};

module.exports = UserProfile;
