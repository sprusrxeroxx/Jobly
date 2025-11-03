// Push Notifications Function
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

exports.sendWelcomePush = functions.auth.user().onCreate(async (user) => {
  const uid = user.uid;
  try {
    const userDoc = await admin.firestore().collection('users').doc(uid).get();
    const token = userDoc.exists ? userDoc.data()?.fcmToken : null;

    if (!token) {
      console.log(`No FCM token for user ${uid}, skipping welcome push.`);
      return null;
    }

    const message = {
      token: token,
      notification: {
        title: 'Welcome to <YourApp> 👋',
        body: 'Thanks for signing up — tap to get started!'
      },
      data: {
        screen: 'welcome', // optional: custom data to route user in app
        uid: uid
      }
    };

    const response = await admin.messaging().send(message);
    console.log('Welcome push sent:', response);
    return response;
  } catch (err) {
    console.error('Error sending welcome push:', err);
    return null;
  }
});