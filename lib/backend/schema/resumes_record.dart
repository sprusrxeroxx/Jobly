import 'dart:async';

import 'package:collection/collection.dart';

import '/backend/schema/util/firestore_util.dart';
import '/backend/schema/util/schema_util.dart';

import 'index.dart';
import '/flutter_flow/flutter_flow_util.dart';

/// A collection of user resumes
class ResumesRecord extends FirestoreRecord {
  ResumesRecord._(
    DocumentReference reference,
    Map<String, dynamic> data,
  ) : super(reference, data) {
    _initializeFields();
  }

  // "user_id" field.
  String? _userId;
  String get userId => _userId ?? '';
  bool hasUserId() => _userId != null;

  // "created_at" field.
  DateTime? _createdAt;
  DateTime? get createdAt => _createdAt;
  bool hasCreatedAt() => _createdAt != null;

  // "updated_at" field.
  DateTime? _updatedAt;
  DateTime? get updatedAt => _updatedAt;
  bool hasUpdatedAt() => _updatedAt != null;

  // "resume_name" field.
  String? _resumeName;
  String get resumeName => _resumeName ?? '';
  bool hasResumeName() => _resumeName != null;

  // "original_resume" field.
  String? _originalResume;
  String get originalResume => _originalResume ?? '';
  bool hasOriginalResume() => _originalResume != null;

  // "job_description" field.
  String? _jobDescription;
  String get jobDescription => _jobDescription ?? '';
  bool hasJobDescription() => _jobDescription != null;

  // "html_resume" field.
  String? _htmlResume;
  String get htmlResume => _htmlResume ?? '';
  bool hasHtmlResume() => _htmlResume != null;

  // "feedbackHistory" field.
  List<String>? _feedbackHistory;
  List<String> get feedbackHistory => _feedbackHistory ?? const [];
  bool hasFeedbackHistory() => _feedbackHistory != null;

  // "is_public" field.
  bool? _isPublic;
  bool get isPublic => _isPublic ?? false;
  bool hasIsPublic() => _isPublic != null;

  void _initializeFields() {
    _userId = snapshotData['user_id'] as String?;
    _createdAt = snapshotData['created_at'] as DateTime?;
    _updatedAt = snapshotData['updated_at'] as DateTime?;
    _resumeName = snapshotData['resume_name'] as String?;
    _originalResume = snapshotData['original_resume'] as String?;
    _jobDescription = snapshotData['job_description'] as String?;
    _htmlResume = snapshotData['html_resume'] as String?;
    _feedbackHistory = getDataList(snapshotData['feedbackHistory']);
    _isPublic = snapshotData['is_public'] as bool?;
  }

  static CollectionReference get collection =>
      FirebaseFirestore.instance.collection('resumes');

  static Stream<ResumesRecord> getDocument(DocumentReference ref) =>
      ref.snapshots().map((s) => ResumesRecord.fromSnapshot(s));

  static Future<ResumesRecord> getDocumentOnce(DocumentReference ref) =>
      ref.get().then((s) => ResumesRecord.fromSnapshot(s));

  static ResumesRecord fromSnapshot(DocumentSnapshot snapshot) =>
      ResumesRecord._(
        snapshot.reference,
        mapFromFirestore(snapshot.data() as Map<String, dynamic>),
      );

  static ResumesRecord getDocumentFromData(
    Map<String, dynamic> data,
    DocumentReference reference,
  ) =>
      ResumesRecord._(reference, mapFromFirestore(data));

  @override
  String toString() =>
      'ResumesRecord(reference: ${reference.path}, data: $snapshotData)';

  @override
  int get hashCode => reference.path.hashCode;

  @override
  bool operator ==(other) =>
      other is ResumesRecord &&
      reference.path.hashCode == other.reference.path.hashCode;
}

Map<String, dynamic> createResumesRecordData({
  String? userId,
  DateTime? createdAt,
  DateTime? updatedAt,
  String? resumeName,
  String? originalResume,
  String? jobDescription,
  String? htmlResume,
  bool? isPublic,
}) {
  final firestoreData = mapToFirestore(
    <String, dynamic>{
      'user_id': userId,
      'created_at': createdAt,
      'updated_at': updatedAt,
      'resume_name': resumeName,
      'original_resume': originalResume,
      'job_description': jobDescription,
      'html_resume': htmlResume,
      'is_public': isPublic,
    }.withoutNulls,
  );

  return firestoreData;
}

class ResumesRecordDocumentEquality implements Equality<ResumesRecord> {
  const ResumesRecordDocumentEquality();

  @override
  bool equals(ResumesRecord? e1, ResumesRecord? e2) {
    const listEquality = ListEquality();
    return e1?.userId == e2?.userId &&
        e1?.createdAt == e2?.createdAt &&
        e1?.updatedAt == e2?.updatedAt &&
        e1?.resumeName == e2?.resumeName &&
        e1?.originalResume == e2?.originalResume &&
        e1?.jobDescription == e2?.jobDescription &&
        e1?.htmlResume == e2?.htmlResume &&
        listEquality.equals(e1?.feedbackHistory, e2?.feedbackHistory) &&
        e1?.isPublic == e2?.isPublic;
  }

  @override
  int hash(ResumesRecord? e) => const ListEquality().hash([
        e?.userId,
        e?.createdAt,
        e?.updatedAt,
        e?.resumeName,
        e?.originalResume,
        e?.jobDescription,
        e?.htmlResume,
        e?.feedbackHistory,
        e?.isPublic
      ]);

  @override
  bool isValidKey(Object? o) => o is ResumesRecord;
}
