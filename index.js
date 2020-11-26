require('dotenv').config();
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

client.on('messageReactionRemove', handleReactionRemove);

client.login(process.env.DISCORD_CLIENT_TOKEN);