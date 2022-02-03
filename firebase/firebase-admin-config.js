// import admin from 'firebase-admin';
// import serviceAcc from './admin-keys.json';

// try {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAcc),
//   });
//   console.log('Initialized.');
// } catch (error) {
//   /*
//    * We skip the "already exists" message which is
//    * not an actual error when we're hot-reloading.
//    */
//   if (!/already exists/u.test(error.message)) {
//     console.error('Firebase admin initialization error', error.stack);
//   }
// }

// // const admin_firestore = admin.firestore();
// const admin_auth = admin.auth();

// const verifyIdToken = (token) => {
//   console.log(token);
//   return admin_auth.verifyIdToken(token);
// };

// export { verifyIdToken };
