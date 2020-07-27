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

module.exports = {
	canTank,
	getRoles,
};