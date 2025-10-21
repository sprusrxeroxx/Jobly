import '/flutter_flow/flutter_flow_util.dart';
import '/index.dart';
import 'view_resume_pg_widget.dart' show ViewResumePgWidget;
import 'package:flutter/material.dart';

class ViewResumePgModel extends FlutterFlowModel<ViewResumePgWidget> {
  ///  Local state fields for this page.

  String viewResumeImprovedText = '\"\"';

  ///  State fields for stateful widgets in this page.

  // State field(s) for TabBar widget.
  TabController? tabBarController;
  int get tabBarCurrentIndex =>
      tabBarController != null ? tabBarController!.index : 0;
  int get tabBarPreviousIndex =>
      tabBarController != null ? tabBarController!.previousIndex : 0;

  // State field(s) for roleNameText widget.
  FocusNode? roleNameTextFocusNode;
  TextEditingController? roleNameTextTextController;
  String? Function(BuildContext, String?)? roleNameTextTextControllerValidator;
  // State field(s) for jobDescriptionText widget.
  FocusNode? jobDescriptionTextFocusNode;
  TextEditingController? jobDescriptionTextTextController;
  String? Function(BuildContext, String?)?
      jobDescriptionTextTextControllerValidator;

  @override
  void initState(BuildContext context) {}

  @override
  void dispose() {
    tabBarController?.dispose();
    roleNameTextFocusNode?.dispose();
    roleNameTextTextController?.dispose();

    jobDescriptionTextFocusNode?.dispose();
    jobDescriptionTextTextController?.dispose();
  }
}
