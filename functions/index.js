const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.beforeCreate = functions.auth.user().beforeCreate((user, context) => {

    if(!user?.email?.includes("@andrew.cmu.edu")) {
       throw new Error("permission-denied","You must sign in with your Andrew email address");
    }

});

exports.onCreate = functions.auth.user().onCreate((user, context) => {

    return new Promise((resolve, reject) => {
        admin.firestore().collection('painters').doc(user.email.split("@")[0]).set({
            id: user.email.split("@")[0],
            email: user.email,
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL
        }).then(() => {
            resolve();
        }).catch((error) => {
            reject(error);
        });
    });

});