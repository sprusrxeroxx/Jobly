import { auth } from 'firebase-functions';

exports.sendWelcomePush = auth.user().onCreate(async (user) => {
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
        screen: 'Dashboard', // optional: custom data to route user in app
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