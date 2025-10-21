import '/backend/api_requests/api_calls.dart';
import '/components/job_description_mod/job_description_mod_widget.dart';
import '/components/old_resume_mod/old_resume_mod_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/index.dart';
import 'create_resume_pg_widget.dart' show CreateResumePgWidget;
import 'package:flutter/material.dart';

class CreateResumePgModel extends FlutterFlowModel<CreateResumePgWidget> {
  ///  Local state fields for this page.
  /// Tracks the loading state of the page
  bool isLoading = true;

  /// contains the improved resume html struct
  String htmlResume = '\"\"';

  /// Contains the original Resume text
  String originalResume = '\"\"';

  /// Contains the job description
  String jobDescription = '\"\"';

  /// Contains the AI feedback
  List<String> feedback = [];
  void addToFeedback(String item) => feedback.add(item);
  void removeFromFeedback(String item) => feedback.remove(item);
  void removeAtIndexFromFeedback(int index) => feedback.removeAt(index);
  void insertAtIndexInFeedback(int index, String item) =>
      feedback.insert(index, item);
  void updateFeedbackAtIndex(int index, Function(String) updateFn) =>
      feedback[index] = updateFn(feedback[index]);

  /// Contains the JSON formated resume struct
  dynamic structuredResume;

  ///  State fields for stateful widgets in this page.

  // State field(s) for PageView widget.
  PageController? pageViewController;

  int get pageViewCurrentIndex => pageViewController != null &&
          pageViewController!.hasClients &&
          pageViewController!.page != null
      ? pageViewController!.page!.round()
      : 0;
  // Model for oldResumeMod component.
  late OldResumeModModel oldResumeModModel;
  // Model for jobDescriptionMod component.
  late JobDescriptionModModel jobDescriptionModModel;
  // Stores action output result for [Backend Call - API (ImproveResume)] action in generateResumeButton widget.
  ApiCallResponse? apiResultbjj;

  @override
  void initState(BuildContext context) {
    oldResumeModModel = createModel(context, () => OldResumeModModel());
    jobDescriptionModModel =
        createModel(context, () => JobDescriptionModModel());
  }

  @override
  void dispose() {
    oldResumeModModel.dispose();
    jobDescriptionModModel.dispose();
  }
}
