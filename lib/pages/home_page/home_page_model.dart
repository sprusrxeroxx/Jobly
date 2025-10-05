import '/backend/api_requests/api_calls.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'home_page_widget.dart' show HomePageWidget;
import 'package:flutter/material.dart';

class HomePageModel extends FlutterFlowModel<HomePageWidget> {
  ///  Local state fields for this page.
  /// Stores the text from the backend resume
  String improvedResumeText = '\"\"';

  /// Tracks the loading state of page
  bool isLoading = true;

  ///  State fields for stateful widgets in this page.

  // State field(s) for resumeTextField widget.
  FocusNode? resumeTextFieldFocusNode;
  TextEditingController? resumeTextFieldTextController;
  String? Function(BuildContext, String?)?
      resumeTextFieldTextControllerValidator;
  // State field(s) for jobDescTextField widget.
  FocusNode? jobDescTextFieldFocusNode;
  TextEditingController? jobDescTextFieldTextController;
  String? Function(BuildContext, String?)?
      jobDescTextFieldTextControllerValidator;
  // Stores action output result for [Backend Call - API (ImproveResume)] action in submitButton widget.
  ApiCallResponse? apiResultbjj;

  @override
  void initState(BuildContext context) {}

  @override
  void dispose() {
    resumeTextFieldFocusNode?.dispose();
    resumeTextFieldTextController?.dispose();

    jobDescTextFieldFocusNode?.dispose();
    jobDescTextFieldTextController?.dispose();
  }
}
