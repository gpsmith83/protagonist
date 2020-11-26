const Discord = require('discord.js');
const Canvas = require('canvas');
const constants = require('../constants');
const db = require('../db');
const barchart = require('../barchart');

const moment = require('moment');
const BlizzAPI = require('blizzapi');

const dungeons = {
	'Sanguine Depths':false,
	'The Necrotic Wake':false,
	'Mists of Tirna Scithe':false,
	'Halls of Atonement':false,
	'Spires of Ascension':false,
	'Theater of Pain':false,
	'De Other Side':false,
	'Plaguefall':false,
};

const api = new BlizzAPI({
	region: 'eu',
	clientId: process.env.BLIZZ_CLIENT_ID,
	clientSecret: process.env.BLIZZ_CLIENT_SECRET,
});

const prefix = '!';

const roles = { '01': 'Tank', '02': 'Healer', '03': 'Mdps', '04': 'Rdps' };

async function handleCommand(message) {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();

	if (command === constants.setupCommand) {
		doSetup(message);
	}
	else if (command === constants.tanksCommand) {
		sendMessageForRole('Tanks', '01', message);
	}
	else if (command === constants.healerCommand) {
		sendMessageForRole('Healers', '02', message);
	}
	else if (command === constants.mdpsCommand) {
		sendMessageForRole('Mdps', '03', message);
	}
	else if (command === constants.rdpsCommand) {
		sendMessageForRole('Rdps', '04', message);
	}
	else if (command == constants.mythic0Command) {
		sendMythic0Response(args.shift().toLowerCase(), message);
	}
	else if (command === constants.immunitiesCommand) {
		sendMessageForImmunities(message);
	}
	else if (command === constants.rolesCommand) {
		const channel = message.channel;
		const canvas = Canvas.createCanvas(700, 250);
		const ctx = canvas.getContext('2d');
		const background = await Canvas.loadImage('./background.png');
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

		const players = db.getPlayers();

		const roleData = {
			'01' : { roleName: 'Tanks', roleId: '01', count: 0 },
			'02' : { roleName: 'Healers', roleId: '02', count: 0 },
			'03' : { roleName: 'MDPS', roleId: '03', count: 0 },
			'04' : { roleName: 'RDPS', roleId: '04', count: 0 },
		};
		(await players).forEach(player => {
			if (!roleData[player.role_id]) {
				roleData[player.role_id] = { roleName: roles[player.role_id], roleId: player.role_id, count: 0 };
			}
			roleData[player.role_id].count++;
		});

		barchart.makeBarchart(canvas, ctx, Object.values(roleData), 'roleName', 'count');

		// Use helpful Attachment class structure to process the file for you
		const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'role-chart.png');

		channel.send('Role Breakdown', attachment);
	}
	else if (command == constants.classesCommand) {
		const channel = message.channel;
		const canvas = Canvas.createCanvas(700, 250);
		const ctx = canvas.getContext('2d');
		const background = await Canvas.loadImage('./background.png');
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

		const players = db.getPlayers();

		const classData = {
			'dh' : { className: 'Demon\nHunter', roleId: 'dh', count: 0 },
			'dk' : { className: 'Death\nKnight', roleId: 'dk', count: 0 },
			'druid' : { className: 'Druid', roleId: 'druid', count: 0 },
			'hunter' : { className: 'Hunter', roleId: 'hunter', count: 0 },
			'mage' : { className: 'Mage', roleId: 'mage', count: 0 },
			'monk' : { className: 'Monk', roleId: 'monk', count: 0 },
			'paladin' : { className: 'Paladin', roleId: 'paladin', count: 0 },
			'priest' : { className: 'Priest', roleId: 'priest', count: 0 },
			'rogue' : { className: 'Rogue', roleId: 'rogue', count: 0 },
			'shaman' : { className: 'Shaman', roleId: 'shaman', count: 0 },
			'warlock' : { className: 'Warlock', roleId: 'warlock', count: 0 },
			'warrior' : { className: 'Warrior', roleId: 'warrior', count: 0 },
		};
		(await players).forEach(player => {
			classData[player.class_id].count++;
		});

		barchart.makeBarchart(canvas, ctx, Object.values(classData), 'className', 'count');

		// Use helpful Attachment class structure to process the file for you
		const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'role-chart.png');

		channel.send('Class Breakdown', attachment);

	}
}

async function sendMessageForRole(roleStr, roleId, message) {
	const players = (await db.getPlayersForRole(roleId)).map(assignment => assignment.user_tag).filter((v, i, s) => s.indexOf(v) === i).join(', ');
	message.channel.send(roleStr + ': ' + players);
}

async function sendMessageForImmunities(message) {
	const players = (await db.getPlayersWithImmunities()).map(assignment => assignment.user_tag).filter((v, i, s) => s.indexOf(v) === i).join(', ');
	message.channel.send('Immunities: ' + players);
}

function doSetup(message) {
	message.channel.send(constants.helpMsg);
	message.channel.send(constants.tankMsg);
	message.channel.send(constants.healerMsg);
	message.channel.send(constants.mdpsMsg);
	message.channel.send(constants.rdpsMsg);
}

function sendMythic0Response(character, message) {
	console.log(character);
	api.query('/profile/wow/character/ravencrest/' + character + '/encounters/dungeons?namespace=profile-eu&locale=en_US').then(result => extractM0(character, result, message)).catch(err => {
		console.log(err);
		message.channel.send('No results found for ' + character);
	});
}

function extractM0(character, result, message) {
	const wedsReset = moment().isoWeekday(3).hour(8);
	const shadowlands = result.expansions.filter(expansion => expansion.expansion.id == 499);
	if (shadowlands && shadowlands[0]) {
		const mythicMap = Object.assign({}, dungeons);
		shadowlands[0].instances.forEach(instance => {
			const mythic = instance.modes.filter(mode => mode.difficulty.type == 'MYTHIC');
			if (mythic && mythic[0]) {
				mythicMap[instance.instance.name] = moment(mythic[0].progress.encounters[0].last_kill_timestamp).isSameOrAfter(wedsReset, 'day');
			}
		});
		message.channel.send('M0 completion for ' + character + '\n' + Object.entries(mythicMap).map(entry => { return entry[0] + ': ' + entry[1]; }).join('\n'));
	}
	else {
		message.channel.send('No results found for ' + character);
	}
}

module.exports = {
	handleCommand,
};