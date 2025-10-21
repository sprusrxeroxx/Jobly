import '/flutter_flow/flutter_flow_util.dart';
import 'old_resume_mod_widget.dart' show OldResumeModWidget;
import 'package:aligned_tooltip/aligned_tooltip.dart';
import 'package:flutter/material.dart';

class OldResumeModModel extends FlutterFlowModel<OldResumeModWidget> {
  ///  State fields for stateful widgets in this component.

  // State field(s) for Tooltip widget.
  AlignedTooltipController? tooltipController;
  // State field(s) for resumeTextField widget.
  FocusNode? resumeTextFieldFocusNode;
  TextEditingController? resumeTextFieldTextController;
  String? Function(BuildContext, String?)?
      resumeTextFieldTextControllerValidator;

  @override
  void initState(BuildContext context) {}

  @override
  void dispose() {
    tooltipController?.dispose();
    resumeTextFieldFocusNode?.dispose();
    resumeTextFieldTextController?.dispose();
  }
}
