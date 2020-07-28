const db = require('../db');
const constants = require('../constants');

async function handleReactionAdd(reaction, user) {
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
	if (reaction.message.content == constants.tankMsg) {
		if (!await db.canTank(reaction.emoji.name)) {
			// Someone made a mistake or was being funny...
			reaction.remove();
		}
		else {
			createAssignment('01', user, reaction);
		}
	}
	else if (reaction.message.content == constants.healerMsg) {
		if (!await db.canHeal(reaction.emoji.name)) {
			// Someone made a mistake or was being funny...
			reaction.remove();
		}
		else {
			createAssignment('02', user, reaction);

		}
	}
	else if (reaction.message.content == constants.mdpsMsg) {
		if (!await db.canMdps(reaction.emoji.name)) {
			// Someone made a mistake or was being funny...
			reaction.remove();
		}
		else {
			createAssignment('03', user, reaction);

		}
	}
	else if (reaction.message.content == constants.rdpsMsg) {
		if (!await db.canRdps(reaction.emoji.name)) {
			// Someone made a mistake or was being funny...
			reaction.remove();
		}
		else {
			createAssignment('04', user, reaction);
		}
	}
}

async function createAssignment(roleId, user, reaction) {
	console.log([user.username, reaction.emoji.name, roleId, user.tag, user.id].join(','));
	await db.createAssignment(user.username, reaction.emoji.name, roleId, user.tag, user.id);
}

async function handleReactionRemove(reaction, user) {
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
	db.removeAssignment(user.id, reaction.emoji.name, getRole(reaction.message.content));
}

function getRole(message) {
	if (message == constants.tankMsg) {
		return '01';
	}
	else if (message == constants.healerMsg) {
		return '02';
	}
	else if (message == constants.mdpsMsg) {
		return '03';
	}
	else if (message == constants.rdpsMsg) {
		return '04';
	}
}

module.exports = {
	handleReactionAdd,
	handleReactionRemove,
};
