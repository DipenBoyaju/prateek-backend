import admin from 'firebase-admin';
import path from 'path';

const serviceAccount = path.resolve('utils/prateek-firebase.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'prateek-77bc7.appspot.com',
});

const bucket = admin.storage().bucket();

export { bucket };
