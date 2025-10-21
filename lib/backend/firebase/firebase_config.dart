import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';

Future initFirebase() async {
  if (kIsWeb) {
    await Firebase.initializeApp(
        options: FirebaseOptions(
            apiKey: "AIzaSyBcTYD5M6z9jWm1pDBWyb_erH5Hs8qPEKc",
            authDomain: "jobly-1f019.firebaseapp.com",
            projectId: "jobly-1f019",
            storageBucket: "jobly-1f019.firebasestorage.app",
            messagingSenderId: "261689119257",
            appId: "1:261689119257:web:80f4cd3b090d8c76e09088",
            measurementId: "G-F6PT7NK2R2"));
  } else {
    await Firebase.initializeApp();
  }
}
