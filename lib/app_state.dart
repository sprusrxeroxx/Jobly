import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class FFAppState extends ChangeNotifier {
  static FFAppState _instance = FFAppState._internal();

  factory FFAppState() {
    return _instance;
  }

  FFAppState._internal();

  static void reset() {
    _instance = FFAppState._internal();
  }

  Future initializePersistedState() async {
    prefs = await SharedPreferences.getInstance();
    _safeInit(() {
      _userID = prefs.getString('ff_userID') ?? _userID;
    });
  }

  void update(VoidCallback callback) {
    callback();
    notifyListeners();
  }

  late SharedPreferences prefs;

  /// Tracks the user id for the current user
  String _userID = '';
  String get userID => _userID;
  set userID(String value) {
    _userID = value;
    prefs.setString('ff_userID', value);
  }

  /// Tracks the current dashboard page index
  int _currentPageViewIndex = 0;
  int get currentPageViewIndex => _currentPageViewIndex;
  set currentPageViewIndex(int value) {
    _currentPageViewIndex = value;
  }

  String _currentJobDescription = '\"\"';
  String get currentJobDescription => _currentJobDescription;
  set currentJobDescription(String value) {
    _currentJobDescription = value;
  }
}

void _safeInit(Function() initializeField) {
  try {
    initializeField();
  } catch (_) {}
}

Future _safeInitAsync(Function() initializeField) async {
  try {
    await initializeField();
  } catch (_) {}
}
