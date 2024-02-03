const functions = require('firebase-functions');

exports.beforeCreate = functions.auth.user().beforeCreate((user, context) => {

    if(!user?.email?.includes("@andrew.cmu.edu")) {
       throw new Error("permission-denied","You must sign in with your Andrew email address");
    }

});