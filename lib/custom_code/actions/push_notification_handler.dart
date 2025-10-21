// Automatic FlutterFlow imports
import '/backend/backend.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'index.dart'; // Imports other custom actions
import '/flutter_flow/custom_functions.dart'; // Imports custom functions
import 'package:flutter/material.dart';
// Begin custom action code
// DO NOT REMOVE OR MODIFY THE CODE ABOVE!

import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

Future pushNotificationHandler(String userId) async {
  // Add your function code here!
  final FirebaseMessaging messaging = FirebaseMessaging.instance;

  // 1) Request permission (iOS & Android 13+)
  NotificationSettings settings = await messaging.requestPermission(
    alert: true,
    announcement: false,
    badge: true,
    carPlay: false,
    criticalAlert: false,
    provisional: false,
    sound: true,
  );

  if (settings.authorizationStatus == AuthorizationStatus.denied) {
    // user denied notifications - handle gracefully
    debugPrint('Push permission denied');
    return;
  }

  // 2) Get the token
  final String? token = await messaging.getToken();
  if (token != null && userId.isNotEmpty) {
    await FirebaseFirestore.instance.collection('users').doc(userId).set(
      {'fcmToken': token},
      SetOptions(merge: true),
    );
    debugPrint('Saved FCM token: $token');
  }

  // 3) Listen for token refresh and update Firestore
  FirebaseMessaging.instance.onTokenRefresh.listen((newToken) async {
    if (userId.isNotEmpty) {
      await FirebaseFirestore.instance.collection('users').doc(userId).set(
        {'fcmToken': newToken},
        SetOptions(merge: true),
      );
    }
  });

  // 4) Handle foreground messages (optional)
  FirebaseMessaging.onMessage.listen((RemoteMessage message) {
    debugPrint(
        'Received foreground message: ${message.notification?.title} - ${message.notification?.body}');
    // Add a UI alert, snackbar, or use flutter_local_notifications to display a local notification.
  });
}
