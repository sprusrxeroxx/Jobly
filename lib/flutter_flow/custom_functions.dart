import 'dart:convert';
import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:timeago/timeago.dart' as timeago;
import 'lat_lng.dart';
import 'place.dart';
import 'uploaded_file.dart';
import '/backend/backend.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '/auth/firebase_auth/auth_util.dart';

/// removes quotes from generated html code
String? removeHTMLQuotes(String? htmlString) {
  String removeHTMLQuotes(String? htmlString) {
    // Return empty string for null input (you can change this to return '' or null handling as you prefer)
    final input = htmlString ?? '';
    if (input.isEmpty) return '';

    var cleaned = input.trim();

    // Remove matching surrounding quotes iteratively (handles nested quotes like '"something"' etc.)
    while ((cleaned.length >= 2) &&
        ((cleaned.startsWith('"') && cleaned.endsWith('"')) ||
            (cleaned.startsWith("'") && cleaned.endsWith("'")) ||
            (cleaned.startsWith('`') && cleaned.endsWith('`')))) {
      cleaned = cleaned.substring(1, cleaned.length - 1).trim();
    }

    return cleaned;
  }
}
