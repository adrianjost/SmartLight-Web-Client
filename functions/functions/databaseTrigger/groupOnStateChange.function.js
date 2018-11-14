const functions = require('firebase-functions');
const admin = require('firebase-admin');

try {
    const serviceAccount = require('./../../serviceAccountKey.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://smartlight-4861d.firebaseio.com",
        databaseAuthVariableOverride: {
            uid: "assistant-api"
        }
    });
}catch(e) {
    console.error(e)
}

const db = admin.database();

exports = module.exports = functions.database.ref('/users/{userId}/groups/{groupId}/current')
.onUpdate((change, context) => {
    const before = change.before.val();
    const after = change.after.val();

    if(before === after){
        return null
    }

    const newState = after;
    return db.ref(`/users/${context.params.userId}/groups/${context.params.groupId}/lamps`).once("value").then((lampsSnap) => {
        let lampPromises = [];
        if(lampsSnap.val()){
            const lamps = lampsSnap.val();
            console.log("got lamps", lamps.length, lamps);

            lampPromises = lamps.map((lampId) => {
                console.log("set lamp", lampId, newState);
                return db.ref(`/users/${context.params.userId}/lamps/${lampId}/current`).set(newState);
            });

            console.log("lamp promises created");
        }
        console.log("lampPromises", lampPromises);
        return Promise.all(lampPromises);
    });
});