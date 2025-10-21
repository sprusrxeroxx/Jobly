import '/backend/api_requests/api_calls.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/form_field_controller.dart';
import 'search_bar_comp_widget.dart' show SearchBarCompWidget;
import 'package:flutter/material.dart';

class SearchBarCompModel extends FlutterFlowModel<SearchBarCompWidget> {
  ///  State fields for stateful widgets in this component.

  // State field(s) for searchFieldText widget.
  FocusNode? searchFieldTextFocusNode;
  TextEditingController? searchFieldTextTextController;
  String? Function(BuildContext, String?)?
      searchFieldTextTextControllerValidator;
  // Stores action output result for [Backend Call - API (searchJob)] action in searchFieldText widget.
  ApiCallResponse? apiResult0lu;
  // State field(s) for ChoiceChips widget.
  FormFieldController<List<String>>? choiceChipsValueController;
  String? get choiceChipsValue =>
      choiceChipsValueController?.value?.firstOrNull;
  set choiceChipsValue(String? val) =>
      choiceChipsValueController?.value = val != null ? [val] : [];

  @override
  void initState(BuildContext context) {}

  @override
  void dispose() {
    searchFieldTextFocusNode?.dispose();
    searchFieldTextTextController?.dispose();
  }
}
