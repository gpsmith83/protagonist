const admin = require('firebase-admin');
admin.initializeApp({
	credential: admin.credential.cert(JSON.parse(process.env.GOOGLE_CREDENTIALS)),
	databaseURL: 'https://pocket-protagonists.firebaseio.com',
});
const db = admin.firestore();

async function getRoles() {
	db.collection('roles').get().then((results) => {
		results.docs.forEach(doc => console.log(doc.id, '=>', doc.data()));
	});
}

async function canTank(className) {
	let returnVal = false;
	const snapshot = await db.collection('classes').where('can_tank', '==', true).get();
	snapshot.forEach(classEntry => {
		if (classEntry.id == className) {
			returnVal = true;
		}
	});
	return returnVal;
}

async function canHeal(className) {
	let returnVal = false;
	const snapshot = await db.collection('classes').where('can_heal', '==', true).get();
	snapshot.forEach(classEntry => {
		if (classEntry.id == className) {
			returnVal = true;
		}
	});
	return returnVal;
}

async function canMdps(className) {
	let returnVal = false;
	const snapshot = await db.collection('classes').where('can_mdps', '==', true).get();
	snapshot.forEach(classEntry => {
		if (classEntry.id == className) {
			returnVal = true;
		}
	});
	return returnVal;
}

async function canRdps(className) {
	let returnVal = false;
	const snapshot = await db.collection('classes').where('can_rdps', '==', true).get();
	snapshot.forEach(classEntry => {
		if (classEntry.id == className) {
			returnVal = true;
		}
	});
	return returnVal;
}

async function hasImmunity(className) {
	let returnVal = false;
	const snapshot = await db.collection('classes').where('has_immunity', '==', true).get();
	snapshot.forEach(classEntry => {
		if (classEntry.id == className) {
			returnVal = true;
		}
	});
	return returnVal;
}

async function createAssignment(username, classId, roleId, userTag, userId) {
	db.collection('assignments').add({ username: username, class_id: classId, role_id: roleId, user_tag: userTag, user_id: userId }).then(
		docRef => console.log(docRef.id),
	);
}

async function removeAssignment(userId, classId, roleId) {
	const assignments = await db.collection('assignments').where('user_id', '==', userId).where('class_id', '==', classId).where('role_id', '==', roleId).get();
	if (!assignments.empty) {
		assignments.forEach(docRef => docRef.ref.delete());
	}
}

async function getPlayersForRole(roleId) {
	const assignments = await db.collection('assignments').where('role_id', '==', roleId).get();
	return assignments.docs.map(doc => doc.data());
}

async function getPlayers() {
	const assignments = await db.collection('assignments').get();
	return assignments.docs.map(doc => doc.data());
}

module.exports = {
	canTank,
	canHeal,
	canMdps,
	canRdps,
	hasImmunity,
	getRoles,
	createAssignment,
	removeAssignment,
	getPlayersForRole,
	getPlayers,
};