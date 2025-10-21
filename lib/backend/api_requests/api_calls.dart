import 'dart:convert';
import 'package:flutter/foundation.dart';

import '/flutter_flow/flutter_flow_util.dart';
import 'api_manager.dart';

export 'api_manager.dart' show ApiCallResponse;

const _kPrivateApiFunctionName = 'ffPrivateApiCall';

class ImproveResumeCall {
  static Future<ApiCallResponse> call({
    String? resume = '',
    String? jobDescription = '',
  }) async {
    final ffApiRequestBody = '''
{
  "resume": "${escapeStringForJson(resume)}",
  "job_description": "${escapeStringForJson(jobDescription)}"
}''';
    return ApiManager.instance.makeApiCall(
      callName: 'ImproveResume',
      apiUrl: 'https://optimizeresume-mo5agvrota-uc.a.run.app',
      callType: ApiCallType.POST,
      headers: {
        'Content-Type': 'application/json',
      },
      params: {},
      body: ffApiRequestBody,
      bodyType: BodyType.JSON,
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
      isStreamingApi: false,
      alwaysAllowBody: false,
    );
  }

  static String? improvedresume(dynamic response) =>
      castToType<String>(getJsonField(
        response,
        r'''$.finalResume''',
      ));
  static dynamic structuredResume(dynamic response) => getJsonField(
        response,
        r'''$.structuredData''',
      );
  static String? htmlResume(dynamic response) =>
      castToType<String>(getJsonField(
        response,
        r'''$.htmlResume''',
      ));
  static List<String>? feedback(dynamic response) => (getJsonField(
        response,
        r'''$.feedbackHistory[1].critique.reasons''',
        true,
      ) as List?)
          ?.withoutNulls
          .map((x) => castToType<String>(x))
          .withoutNulls
          .toList();
}

class SearchJobCall {
  static Future<ApiCallResponse> call({
    String? query = '\"Sofware development jobs in johannesburg\"',
    int? page = 1,
    String? country = 'za',
    String? datePosted = 'all',
  }) async {
    return ApiManager.instance.makeApiCall(
      callName: 'searchJob',
      apiUrl: 'https://jsearch.p.rapidapi.com/search',
      callType: ApiCallType.GET,
      headers: {
        'x-rapidapi-host': 'jsearch.p.rapidapi.com',
        'x-rapidapi-key': '96fdf06805msheb1cf0f12afc764p15e6b4jsndf1efd54406a',
      },
      params: {
        'query': query,
        'page': page,
        'country': country,
        'date_posted': datePosted,
      },
      returnBody: true,
      encodeBodyUtf8: false,
      decodeUtf8: false,
      cache: false,
      isStreamingApi: false,
      alwaysAllowBody: false,
    );
  }

  static List? jobListings(dynamic response) => getJsonField(
        response,
        r'''$.data[:]''',
        true,
      ) as List?;
  static List<String>? jobTitle(dynamic response) => (getJsonField(
        response,
        r'''$.data[:].job_title''',
        true,
      ) as List?)
          ?.withoutNulls
          .map((x) => castToType<String>(x))
          .withoutNulls
          .toList();
  static List<String>? employerLogo(dynamic response) => (getJsonField(
        response,
        r'''$.data[:].employer_logo''',
        true,
      ) as List?)
          ?.withoutNulls
          .map((x) => castToType<String>(x))
          .withoutNulls
          .toList();
  static List<String>? employerName(dynamic response) => (getJsonField(
        response,
        r'''$.data[:].employer_name''',
        true,
      ) as List?)
          ?.withoutNulls
          .map((x) => castToType<String>(x))
          .withoutNulls
          .toList();
  static List<String>? employerWebSite(dynamic response) => (getJsonField(
        response,
        r'''$.data[:].employer_website''',
        true,
      ) as List?)
          ?.withoutNulls
          .map((x) => castToType<String>(x))
          .withoutNulls
          .toList();
  static List<String>? jobApplyLink(dynamic response) => (getJsonField(
        response,
        r'''$.data[:].job_apply_link''',
        true,
      ) as List?)
          ?.withoutNulls
          .map((x) => castToType<String>(x))
          .withoutNulls
          .toList();
  static List? applyOptions(dynamic response) => getJsonField(
        response,
        r'''$.data[:].apply_options''',
        true,
      ) as List?;
  static List<String>? jobDescription(dynamic response) => (getJsonField(
        response,
        r'''$.data[:].job_description''',
        true,
      ) as List?)
          ?.withoutNulls
          .map((x) => castToType<String>(x))
          .withoutNulls
          .toList();
  static List<String>? jobPostedAtUTC(dynamic response) => (getJsonField(
        response,
        r'''$.data[:].job_posted_at_datetime_utc''',
        true,
      ) as List?)
          ?.withoutNulls
          .map((x) => castToType<String>(x))
          .withoutNulls
          .toList();
  static List<String>? jobLocation(dynamic response) => (getJsonField(
        response,
        r'''$.data[:].job_location''',
        true,
      ) as List?)
          ?.withoutNulls
          .map((x) => castToType<String>(x))
          .withoutNulls
          .toList();
  static List<String>? jobEmploymentType(dynamic response) => (getJsonField(
        response,
        r'''$.data[:].job_employment_type''',
        true,
      ) as List?)
          ?.withoutNulls
          .map((x) => castToType<String>(x))
          .withoutNulls
          .toList();
  static List<String>? jobPostedAt(dynamic response) => (getJsonField(
        response,
        r'''$.data[:].job_posted_at''',
        true,
      ) as List?)
          ?.withoutNulls
          .map((x) => castToType<String>(x))
          .withoutNulls
          .toList();
}

class ApiPagingParams {
  int nextPageNumber = 0;
  int numItems = 0;
  dynamic lastResponse;

  ApiPagingParams({
    required this.nextPageNumber,
    required this.numItems,
    required this.lastResponse,
  });

  @override
  String toString() =>
      'PagingParams(nextPageNumber: $nextPageNumber, numItems: $numItems, lastResponse: $lastResponse,)';
}

String _toEncodable(dynamic item) {
  if (item is DocumentReference) {
    return item.path;
  }
  return item;
}

String _serializeList(List? list) {
  list ??= <String>[];
  try {
    return json.encode(list, toEncodable: _toEncodable);
  } catch (_) {
    if (kDebugMode) {
      print("List serialization failed. Returning empty list.");
    }
    return '[]';
  }
}

String _serializeJson(dynamic jsonVar, [bool isList = false]) {
  jsonVar ??= (isList ? [] : {});
  try {
    return json.encode(jsonVar, toEncodable: _toEncodable);
  } catch (_) {
    if (kDebugMode) {
      print("Json serialization failed. Returning empty json.");
    }
    return isList ? '[]' : '{}';
  }
}

String? escapeStringForJson(String? input) {
  if (input == null) {
    return null;
  }
  return input
      .replaceAll('\\', '\\\\')
      .replaceAll('"', '\\"')
      .replaceAll('\n', '\\n')
      .replaceAll('\t', '\\t');
}
