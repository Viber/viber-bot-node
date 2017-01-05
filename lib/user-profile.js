"use strict";

function UserProfile(id, name, avatar, country, language) {
	this.id = id;
	this.name = name;
	this.avatar = avatar || null;
	this.country = country || null;
	this.language = language || null;
	Object.freeze(this);
}

UserProfile.fromJson = function(jsonSender) {
	if (!jsonSender) throw new Error("Json data must be non-null");
	return new UserProfile(jsonSender.id, jsonSender.name, jsonSender.avatar, jsonSender.country, jsonSender.language);
};

module.exports = UserProfile;