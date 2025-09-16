// Firebase Admin SDK setup for backend token verification
const admin = require("firebase-admin");

let serviceAccount = require("./serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;
