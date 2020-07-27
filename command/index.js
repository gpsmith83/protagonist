const constants = require('../constants');

const prefix = '!';

async function handleCommand(message) {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();

	if (command === constants.setupCommand) {
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