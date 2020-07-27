const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

const { handleCommand } = require('./command');
const { handleReactionAdd, handleReactionRemove } = require ('./reaction');


client.once('ready', () => {
	console.log(client.user.id);
	console.log('Ready!');
});

client.on('message', handleCommand);

client.on('messageReactionAdd', handleReactionAdd);

client.on('messageReactionRemove', async (reaction, user) => {
	console.log(user.id);
	if (reaction.partial) {
		try {
			await reaction.fetch();
		}
		catch (error) {
			console.log('Something went wrong when fetching the message: ', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}
});

client.login(process.env.DISCORD_CLIENT_TOKEN);