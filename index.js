const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const db = require('./db');

const tankMsg = '__***Tank***__';
const healerMsg = '__***Healer***__';
const mdpsMsg = '__***Melee DPS***__';
const rdpsMsg = '__***Ranged DPS***__';
const helpMsg = 'React to the roles below with the class you will be using, there are reactions for each class.  If you are planning to maintain more than one class/spec then react as many times as needed!';

client.once('ready', () => {
	console.log(client.user.id);
	console.log('Ready!');
	db.getRoles();
});

client.on('message', async (message) => {
	if (message.content === '!setup') {
		message.channel.send(helpMsg);
		message.channel.send(tankMsg);
		message.channel.send(healerMsg);
		message.channel.send(mdpsMsg);
		message.channel.send(rdpsMsg);
	}
});

client.on('messageReactionAdd', async (reaction, user) => {
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
	if (reaction.message.content == tankMsg) {
		if (!await db.canTank(reaction.emoji.name)) {
			// Someone made a mistake or was being funny...
			reaction.remove();
		}
		else {
			// Now we want to add this person to the database of assignments
			console.log([user.username, reaction.emoji.name, '01', user.tag, user.id].join(','));
		}
	}

	// Now the message has been cached and is fully available
	console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a "${reaction.emoji.name}" from "${user.tag}"!`);
	// The reaction is now also fully available and the properties will be reflected accurately:
	console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
});

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