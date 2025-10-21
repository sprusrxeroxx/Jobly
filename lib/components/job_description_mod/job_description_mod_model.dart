import '/flutter_flow/flutter_flow_util.dart';
import 'job_description_mod_widget.dart' show JobDescriptionModWidget;
import 'package:aligned_tooltip/aligned_tooltip.dart';
import 'package:flutter/material.dart';

class JobDescriptionModModel extends FlutterFlowModel<JobDescriptionModWidget> {
  ///  State fields for stateful widgets in this component.

  // State field(s) for Tooltip widget.
  AlignedTooltipController? tooltipController;
  // State field(s) for jobDescTextField widget.
  FocusNode? jobDescTextFieldFocusNode;
  TextEditingController? jobDescTextFieldTextController;
  String? Function(BuildContext, String?)?
      jobDescTextFieldTextControllerValidator;

  @override
  void initState(BuildContext context) {}

  @override
  void dispose() {
    tooltipController?.dispose();
    jobDescTextFieldFocusNode?.dispose();
    jobDescTextFieldTextController?.dispose();
  }
}
