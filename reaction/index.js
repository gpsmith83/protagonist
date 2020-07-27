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
			// Now we want to add this person to the database of assignments
			console.log([user.username, reaction.emoji.name, '01', user.tag, user.id].join(','));
			await db.createAssignment(user.username, reaction.emoji.name, '01', user.tag, user.id);
		}
	}
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
