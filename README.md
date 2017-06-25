# Viber Node.JS Bot API
Use this library to develop a bot for the Viber platform.
The library is available on [GitHub](https://github.com/Viber/viber-bot-node) as well as a package on [npm](https://www.npmjs.com/package/viber-bot).

## License
This library is released under the terms of the Apache 2.0 license. See [License](https://github.com/Viber/viber-bot-node/blob/master/LICENSE.md) for more information.

## Library Prerequisites
* Node >= 5.0.0
* Get your Viber Public Account authentication token. Your token is generated and provided to you during the Public Account creation process. As a Public Account admin, you can always find the account token in the "edit info" page.
* SSL Certification - You'll need a trusted (ca.pem) certificate, not self-signed. You can find one at [Let's Encrypt](https://letsencrypt.org/) or buy one.

## Installation
This library is released on [npm](https://www.npmjs.com/package/viber-bot).

### npm
Install with [`npm install viber-bot --save`](https://www.npmjs.com/package/viber-bot)

### Express
If you are already using express or equivalent, you can do the following:

```javascript
app.use("/viber/webhook", bot.middleware());
```
Please revisit [app.use()](http://expressjs.com/en/api.html#app.use) documentation.
For more information see [ViberBot.middleware()](#middleware).

## Let's get started!
Creating a basic Viber bot is simple:

1. Import `viber-bot` library to your project
2. Create a Public Account and use the API key from [https://developers.viber.com]()
3. Configure your bot as described in the documentation below
4. Add the bot as middleware to your server with `bot.middleware()`
5. Start your web server
6. Call setWebhook(url) with your web server url

### Creating an echo Bot
Firstly, let's *import and configure* our bot:

```javascript
'use strict';

const ViberBot  = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;

const bot    = new ViberBot({
	authToken: YOUR_AUTH_TOKEN_HERE,
	name: "EchoBot",
	avatar: "http://viber.com/avatar.jpg" // It is recommended to be 720x720, and no more than 100kb.
});

// Perfect! Now here's the key part:
bot.on(BotEvents.MESSAGE_RECEIVED, (message, response) => {
	// Echo's back the message to the client. Your bot logic should sit here.
	response.send(message);
});

// Wasn't that easy? Let's create HTTPS server and set the webhook:
const https = require('https');
const port  = process.env.PORT || 8080;

// Viber will push messages sent to this URL. Web server should be internet-facing.
const webhookUrl = process.env.WEBHOOK_URL;

const httpsOptions = { key: ... , cert: ... , ca: ... }; // Trusted SSL certification (not self-signed).
https.createServer(httpsOptions, bot.middleware()).listen(port, () => bot.setWebhook(webhookUrl));
```

### Using Winston logger
We provide an option to use [Winston](https://www.npmjs.com/package/winston) logger with our library.
The only requirement is that you use Winston >= 2.0.0.

```javascript
'use strict';

const ViberBot  = require('viber-bot').Bot;
const winston   = require('winston');
const toYAML    = require('winston-console-formatter'); // makes the output more friendly

function createLogger() {
	const logger = new winston.Logger({ level: "debug" }); // We recommend DEBUG for development
	logger.add(winston.transports.Console, toYAML.config());
	return logger;
}

const logger = createLogger();
const bot    = new ViberBot({
	logger: logger,
	authToken: ...,
	...
});
```

### Do you supply a basic router for text messages?
Well funny you ask. Yes we do. But a word of warning - messages sent to your router callback will also be emitted to the `BotEvents.MESSAGE_RECEIVED` event.

```javascript
const TextMessage = require('viber-bot').Message.Text;

// A simple regular expression to answer messages in the form of 'hi' and 'hello'.
bot.onTextMessage(/^hi|hello$/i, (message, response) =>
    response.send(new TextMessage(`Hi there ${response.userProfile.name}. I am ${bot.name}`)));
```

Have you noticed how we created the `TextMessage` instance? There's a all bunch of message types you should get familiar with.

* [Text Message](#TextMessage)
* [Url Message](#UrlMessage)
* [Contact Message](#ContactMessage)
* [Picture Message](#PictureMessage)
* [Video Message](#VideoMessage)
* [Location Message](#LocationMessage)
* [Sticker Message](#StickerMessage)
* [File Message](#FileMessage)
* [Rich Media Message](#RichMediaMessage)
* [Keyboard Message](#KeyboardMessage)

Creating them is easy! Every message object has its own unique constructor corresponding to its API implementation. Click on each type in the list to find out more. Check out the full API documentation for more advanced uses.

## API

### Viber Bot

`require('viber-bot').Bot`

An event emitter, emitting events [described here](#onEvent).

* ViberBot
    * [new ViberBot()](#newViberBot)
    * [.getBotProfile()](#getBotProfile) ⇒ `promise.JSON`
    * [.getUserDetails(userProfile)](#getUserDetails) ⇒ `promise.JSON`
    * [.getOnlineStatus(viberUserIds)](#getOnlineStatus) ⇒ `promise.JSON`
    * [.setWebhook(url)](#setWebhook) ⇒ `promise.JSON`
    * [.sendMessage(userProfile, messages, [optionalTrackingData])](#sendMessage) ⇒ `promise.ARRAY`
    * [.postToPublicChat(userProfile, messages)](#postToPublicChat) ⇒ `promise.ARRAY`
    * [.on(handler)](#onEvent)
    * [.onTextMessage(regex, handler)](#onTextMessage) : `handler` = [`TextMessageHandlerCallback`](#TextMessageHandlerCallback)
    * [.onError(handler)](#onError) : `handler` = [`ErrorHandlerCallback`](#ErrorHandlerCallback)
    * [.onConversationStarted(userProfile, isSubscribed, context, onFinish)](#onConversationStarted) : `onFinish` = [`ConversationStartedOnFinishCallback`](#ConversationStartedOnFinishCallback)
    * [.onSubscribe(handler)](#onSubscribe) : `handler` = [`SubscribeResponseHandlerCallback`](#SubscribeResponseHandlerCallback)
    * [.onUnsubscribe(handler)](#onUnsubscribe) : `handler` = [`UnsubscribeResponseHandlerCallback`](#UnsubscribeResponseHandlerCallback)
    * [.middleware()](#middleware)


<a name="newViberBot"></a>

### New ViberBot()

| Param | Type | Description |
| --- | --- | --- |
| options.logger | `object` | Winston logger |
| options.authToken | `string` | Viber Auth Token  |
| options.name | `string` | Your BOT Name |
| options.avatar | `string` | Avatar URL. **No more than 100kb.** |
| options.registerToEvents | `array` | example: ["message", "delivered"] |

<a name="onEvent"></a>

### bot.on(handler)

`require('viber-bot').Events`

| Param | Type |
| --- | --- |
| handler | `EventHandlerCallback` |
| message | [`Message Object`](#MessageObject) |
| response | [`Response Object`](#ResponseObject) |
| err | `Error Object` |

Subscribe to events:

* MESSAGE_RECEIVED (Callback:  `function (message, response) {}`)
* MESSAGE_SENT (Callback:  `function (message, userProfile) {}`)
* SUBSCRIBED (Callback:  `function (response) {}`)
* UNSUBSCRIBED (Callback:  `function (response) {}`)
* CONVERSATION_STARTED (Callback:  `function (userProfile, isSubscribed, context, onFinish) {}`)
* ERROR (Callback:  `function (err) {}`)

**Example**  

```js
bot.on(BotEvents.MESSAGE_RECEIVED, (message, response) => ... );
bot.on(BotEvents.MESSAGE_SENT, (message, userProfile) => ... );
bot.on(BotEvents.CONVERSATION_STARTED, (userProfile, isSubscribed, context, onFinish) => ... );
bot.on(BotEvents.ERROR, err => ... );
bot.on(BotEvents.UNSUBSCRIBED, response => ... );
bot.on(BotEvents.SUBSCRIBED, response =>
    response.send(`Thanks for subscribing, ${response.userProfile.name}`));
```

<a name="getBotProfile"></a>

### bot.getBotProfile()

Returns a `promise.JSON` [with the following JSON](https://developers.viber.com/docs/api/rest-bot-api/#get-account-info).

```js
bot.getBotProfile().then(response => console.log(`Public Account Named: ${response.name}`));
```

<a name="getUserDetails"></a>

### bot.getUserDetails(userProfile)

| Param | Type | Description |
| --- | --- | --- |
| userProfile | [`UserProfile`](#UserProfile) | `UserProfile` object |

The `getUserDetails` function will fetch the details of a specific Viber user based on his unique user ID. The user ID can be obtained from the callbacks sent to the PA regrading user's actions. This request can be sent twice during a 12 hours period for each user ID.

Returns a `promise.JSON`.

```js
bot.onSubscribe(response => bot.getUserDetails(response.userProfile)
        .then(userDetails => console.log(userDetails)));
```

<a name="getOnlineStatus"></a>

### bot.getOnlineStatus(viberUserIds)

| Param | Type | Description |
| --- | --- | --- |
| viberUserIds | `array of strings` | Collection of Viber user ids |

Returns a `promise.JSON`.

```js
bot.getOnlineStatus(["a1, "a2"]).then(onlineStatus => console.log(onlineStatus));
```

<a name="setWebhook"></a>

### bot.setWebhook(url)

| Param | Type | Description |
| --- | --- | --- |
| url | `string` | Trusted SSL Certificate |

Returns a `promise.JSON`.

```js
bot.setWebhook("https://my.bot/incoming").then(() => yourBot.doSomething()).catch(err => console.log(err));
```

<a name="sendMessage"></a>

### bot.sendMessage(userProfile, messages, [optionalTrackingData])

| Param | Type | Description |
| --- | --- | --- |
| userProfile | [`UserProfile`](#UserProfile) | `UserProfile` object |
| Messages | `object or array` | Can be `Message` object or array of `Message` objects |
| [optionalTrackingData] | `JSON` | Optional. JSON Object. Returned on every message sent by the client |

*Note*: When passing array of messages to `sendMessage`, messages will be sent by explicit order (the order which they were given to the `sendMessage` method). The library will also cancel all custom keyboards except the last one, sending only the last message keyboard.

Returns a `promise.ARRAY` array of message tokens.

```js
// Single message
const TextMessage = require('viber-bot').Message.Text;
bot.sendMessage(userProfile, new TextMessage("Thanks for shopping with us"));

// Multiple messages
const UrlMessage  = require('viber-bot').Message.Url;
bot.sendMessage(userProfile, [
    new TextMessage("Here's the product you've requested:"),
    new UrlMessage("http://my.ecommerce.site/product1"),
    new TextMessage("Shipping time: 1-3 business days")
]);
```

<a name="postToPublicChat"></a>

### bot.postToPublicChat(userProfile, messages)
The Viber post API allows the PA owner to post a message in the Public Account’s public chat.

| Param | Type | Description |
| --- | --- | --- |
| userProfile | [`UserProfile`](#UserProfile) | `UserProfile` object |
| messages | `object or array` | Can be `Message` object or array of `Message` objects |

**Note:** When passing array of messages to `postToPublicChat`, messages will be sent by explicit order (the order which they were given to the `postToPublicChat` method).

**Note:** This method does not support keyboard attachment.

Returns a `promise.ARRAY` array of message tokens.

```js
// Single message
const TextMessage = require('viber-bot').Message.Text;
bot.postToPublicChat(userProfile, new TextMessage("Thanks for shopping with us"));

// Multiple messages
const UrlMessage  = require('viber-bot').Message.Url;
bot.postToPublicChat(userProfile, [
    new TextMessage("Here's the product you've requested:"),
    new UrlMessage("http://my.ecommerce.site/product1"),
    new TextMessage("Shipping time: 1-3 business days")
]);
```

<a name="middleware"></a>

### bot.middleware()

Returns a middleware implementation to use with `http/https`.

```js
const https = require('https');
https.createServer({ key: ... , cert: ... , ca: ... }, bot.middleware()).listen(8080);
```

<a name="onTextMessage"></a>

### bot.onTextMessage(regex, handler)

| Param | Type |
| --- | --- |
| regex | `regular expression` |
| handler | [`TextMessageHandlerCallback`](#TextMessageHandlerCallback) |

<a name="TextMessageHandlerCallback"></a>

##### TextMessageHandlerCallback: `function (message, response) {}`

```js
bot.onTextMessage(/^hi|hello$/i, (message, response) =>
    response.send(new TextMessage(`Hi there ${response.userProfile.name}. I am ${bot.name}`)));
```

<a name="onError"></a>

### bot.onError(handler)

| Param | Type |
| --- | --- |
| handler | [`ErrorHandlerCallback`](#ErrorHandlerCallback) |

<a name="ErrorHandlerCallback"></a>

##### ErrorHandlerCallback: `function (err) {}`

```js
bot.onError(err => logger.error(err));
```

<a name="onConversationStarted"></a>

### bot.onConversationStarted(userProfile, isSubscribed, context, onFinish)

| Param | Type | Description |
| --- | --- | --- |
| userProfile | [`UserProfile`](#UserProfile) | `UserProfile` object |
| isSubscribed | boolean | Indicates whether a user is already subscribed |
| context | String | Any additional parameters added to the deep link used to access the conversation passed as a string |
| onFinish | [`ConversationStartedOnFinishCallback`](#ConversationStartedOnFinishCallback) | When called, a [`Message`](#MessageObject) will be sent to the client |

Conversation started event fires when a user opens a conversation with the PA using the “message” button (found on the PA’s info screen) or using a [deep link](https://developers.viber.com/docs/tools/deep-links/).

This event is **not** considered a subscribe event and doesn't allow the PA to send messages to the user; however, it will allow sending one "welcome message" to the user.

<a name="ConversationStartedOnFinishCallback"></a>

##### ConversationStartedOnFinishCallback: `function (responseMessage, optionalTrackingData) {}`

The `ConversationStartedOnFinishCallback` accepts `null` and [`MessageObject`](#MessageObject) only. Otherwise, an exception is thrown.

```js
bot.onConversationStarted((userProfile, isSubscribed, context, onFinish) =>
	onFinish(new TextMessage(`Hi, ${userProfile.name}! Nice to meet you.`)));

bot.onConversationStarted((userProfile, isSubscribed, context, onFinish) =>
    onFinish(new TextMessage(`Thanks`), { saidThanks: true }));
```

<a name="onSubscribe"></a>

### bot.onSubscribe(handler)

| Param | Type |
| --- | --- |
| handler | [`SubscribeResponseHandlerCallback`](#SubscribeResponseHandlerCallback) |

<a name="SubscribeResponseHandlerCallback"></a>

##### SubscribeResponseHandlerCallback: `function (response) {}`

```js
bot.onSubscribe(response => console.log(`Subscribed: ${response.userProfile.name}`));
```

<a name="onUnsubscribe"></a>

### bot.onUnsubscribe(handler)

| Param | Type |
| --- | --- |
| handler | [`UnsubscribeResponseHandlerCallback`](#UnsubscribeResponseHandlerCallback) |

<a name="UnsubscribeResponseHandlerCallback"></a>

##### UnsubscribeResponseHandlerCallback: `function (userId) {}`

```js
bot.onUnsubscribe(userId => console.log(`Unsubscribed: ${userId}`));
```

<a name="ResponseObject"></a>

### Response object

Members:

| Param | Type | Notes |
| --- | --- | --- |
| userProfile | [`UserProfile`](#UserProfile) | --- |

* Response
    * [.send(messages, [optionalTrackingData])](#sendMessage) ⇒ `promise.JSON`

<a name="UserProfile"></a>

### UserProfile object

Members:

| Param | Type | Notes |
| --- | --- | --- |
| id | `string` | --- |
| name | `string` | --- |
| avatar | `string` | Optional Avatar URL |
| country | `string` | **currently set in CONVERSATION_STARTED event only** |
| language | `string` | **currently set in CONVERSATION_STARTED event only** |

<a name="MessageObject"></a>

### Message Object

```javascript
const TextMessage     = require('viber-bot').Message.Text;
const UrlMessage      = require('viber-bot').Message.Url;
const ContactMessage  = require('viber-bot').Message.Contact;
const PictureMessage  = require('viber-bot').Message.Picture;
const VideoMessage    = require('viber-bot').Message.Video;
const LocationMessage = require('viber-bot').Message.Location;
const StickerMessage  = require('viber-bot').Message.Sticker;
const RichMediaMessage  = require('viber-bot').Message.RichMedia;
const KeyboardMessage  = require('viber-bot').Message.Keyboard;
```

**Common Members for `Message` interface**:

| Param | Type | Description |
| --- | --- | --- |
| timestamp | `string` | Epoch time |
| token | `string` | Sequential message token |
| trackingData | `JSON` | JSON Tracking Data from Viber Client |

**Common Constructor Arguments `Message` interface**:

| Param | Type | Description |
| --- | --- | --- |
| optionalKeyboard | `JSON` | [Writing Custom Keyboards](https://developers.viber.com/docs/tools/keyboards/) |
| optionalTrackingData | `JSON` | Data to be saved on Viber Client device, and sent back each time message is received |

<a name="TextMessage"></a>

#### TextMessage object

| Member | Type
| --- | --- |
| text | `string` |

```javascript
const message = new TextMessage(text, [optionalKeyboard], [optionalTrackingData]);
console.log(message.text);
```

<a name="UrlMessage"></a>

#### UrlMessage object

| Member | Type
| --- | --- |
| url | `string` |

```javascript
const message = new UrlMessage(url, [optionalKeyboard], [optionalTrackingData]);
console.log(message.url);
```

<a name="ContactMessage"></a>

#### ContactMessage object

| Member | Type
| --- | --- |
| contactName | `string` |
| contactPhoneNumber | `string` |

```javascript
const message = new ContactMessage(contactName, contactPhoneNumber, [optionalAvatar], [optionalKeyboard], [optionalTrackingData]);
console.log(`${message.contactName}, ${message.contactPhoneNumber}`);
```

<a name="PictureMessage"></a>

#### PictureMessage object

| Member | Type
| --- | --- |
| url | `string` |
| text | `string` |
| thumbnail | `string` |

```javascript
const message = new PictureMessage(url, [optionalText], [optionalThumbnail], [optionalKeyboard], [optionalTrackingData]);
console.log(`${message.url}, ${message.text}, ${message.thumbnail}`);
```

<a name="VideoMessage"></a>

#### VideoMessage object

| Member | Type
| --- | --- |
| url | `string` |
| size | `int` |
| thumbnail | `string` |
| duration | `int` |

```javascript
const message = new VideoMessage(url, size, [optionalText], [optionalThumbnail], [optionalDuration], [optionalKeyboard], [optionalTrackingData]);
console.log(`${message.url}, ${message.size}, ${message.thumbnail}, ${message.duration}`);
```

<a name="LocationMessage"></a>

#### LocationMessage object

| Member | Type
| --- | --- |
| latitude | `float` |
| longitude | `float` |

```javascript
const message = new LocationMessage(latitude, longitude, [optionalKeyboard], [optionalTrackingData]);
console.log(`${message.latitude}, ${message.longitude}`);
```

<a name="StickerMessage"></a>

#### StickerMessage object

| Member | Type
| --- | --- |
| stickerId | `int` |

```javascript
const message = new StickerMessage(stickerId, [optionalKeyboard], [optionalTrackingData]);
console.log(message.stickerId);
```

<a name="FileMessage"></a>

#### FileMessage object

| Member | Type
| --- | --- |
| url | `string` |
| sizeInBytes | `int` |
| filename | `string` |

```javascript
const message = new FileMessage(url, sizeInBytes, filename, [optionalKeyboard], [optionalTrackingData]);
console.log(`${message.url}, ${message.sizeInBytes}, ${message.filename}`);
```

<a name="RichMediaMessage"></a>

#### RichMediaMessage object

| Member | Type
| --- | --- |
| richMedia | `Object` |

```javascript
const SAMPLE_RICH_MEDIA = {
	"ButtonsGroupColumns": 6,
	"ButtonsGroupRows": 2,
	"BgColor": "#FFFFFF",
	"Buttons": [{
		"ActionBody": "http://www.website.com/go_here",
		"ActionType": "open-url",
		"BgMediaType": "picture",
		"Image": "http://www.images.com/img.jpg",
		"BgColor": "#000000",
		"TextOpacity": 60,
		"Rows": 1,
		"Columns": 6
	}, {
		"ActionBody": "http://www.website.com/go_here",
		"ActionType": "open-url",
		"BgColor": "#85bb65",
		"Text": "Buy",
		"TextOpacity": 60,
		"Rows": 1,
		"Columns": 6
	}]
};

const message = new RichMedia(SAMPLE_RICH_MEDIA, [optionalKeyboard], [optionalTrackingData]);
```

<a name="KeyboardMessage"></a>

#### KeyboardMessage object

| Member | Type
| --- | --- |
| keyboard | `JSON` |

```javascript

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
			"ActionBody": "Yes"
		}
	]
};

const message = new KeyboardMessage(SAMPLE_KEYBOARD, [optionalTrackingData]);
```

## Sample project
We've created the [Is It Up sample project](https://github.com/Viber/sample-bot-isitup) to help you get started.

## Community
Join the conversation on **[Gitter](https://gitter.im/viber/bot-node)**.
