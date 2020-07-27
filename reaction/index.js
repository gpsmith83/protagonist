const db = require('../db');
const constants = require('../constants');

let localData = [];

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
			localData.push({
				username: user.username,
				classId: reaction.emoji.name,
				roleId: '01',
				userTag: user.tag,
				userId: user.id,
			});
			console.log(localData);
		}
	}

	// Now the message has been cached and is fully available
	console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a "${reaction.emoji.name}" from "${user.tag}"!`);
	// The reaction is now also fully available and the properties will be reflected accurately:
	console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
}

async function handleReactionRemove(reaction, user) {
	localData = localData.filter(el => {
		return !(el.userId == user.id && el.classId == reaction.emoji.name);
	});
	console.log(localData);
}

module.exports = {
	handleReactionAdd,
	handleReactionRemove,
};
