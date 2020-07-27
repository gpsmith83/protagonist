const constants = require('../constants');

async function handleCommand(message) {
	if (message.content === '!setup') {
		message.channel.send(constants.helpMsg);
		message.channel.send(constants.tankMsg);
		message.channel.send(constants.healerMsg);
		message.channel.send(constants.mdpsMsg);
		message.channel.send(constants.rdpsMsg);
	}
}

module.exports = {
	handleCommand,
};