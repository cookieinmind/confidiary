// import {
//   admin_auth as auth,
//   admin_firestore as db,
// } from '../../firebase/firebase-admin-config';
import Data from './data.json';

export default async function handler(req, res) {
  return res.status(200).json({ status: '' });
  // try {
  //   console.log('beginning!', Data.length);

  //   const documentToSend = {};
  //   for (const d of Data) {
  //     const name = d.name;
  //     const data = { ...d };
  //     documentToSend[name] = data;
  //   }

  //   // console.log(documentToSend);

  //   // Get a new write batch
  //   const batch = db.batch();

  //   //Add the data
  //   const docRef = db.collection('default_feelings').doc('default');
  //   batch.set(docRef, documentToSend);

  //   // Commit the batch
  //   await batch.commit();

  //   res.status(200).json({ status: 'Success' });
  // } catch (e) {
  //   console.error(e);
  // }
}

// export default withAuth(handler);

// function withAuth(handler) {
//   return async (req, res) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//       return res.status(401).end('Not authenticated. No Auth header');
//     }

//     const token = authHeader.split(' ')[1];
//     let decodedToken;
//     try {
//       decodedToken = await auth.verifyIdToken(token);
//       if (!decodedToken || !decodedToken.uid)
//         return res.status(401).end('Not authenticated');
//       req.uid = decodedToken.uid;
//     } catch (error) {
//       console.log(error.errorInfo);
//       const errorCode = error.errorInfo.code;
//       error.status = 401;
//       if (errorCode === 'auth/internal-error') {
//         error.status = 500;
//       }
//       //TODO handlle firebase admin errors in more detail
//       return res.status(error.status).json({ error: errorCode });
//     }

//     return handler(req, res);
//   };
// }
