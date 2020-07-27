const admin = require('firebase-admin');
admin.initializeApp({
	credential: admin.credential.cert(JSON.parse(process.env.GOOGLE_CREDENTIALS)),
	databaseURL: 'https://pocket-protagonists.firebaseio.com',
});
const db = admin.firestore();

function getRoles() {
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

module.exports = {
	canTank,
	canHeal,
	canMdps,
	canRdps,
	hasImmunity,
	getRoles,
};