import '/components/search_bar_comp/search_bar_comp_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'search_bar_widget.dart' show SearchBarWidget;
import 'package:flutter/material.dart';

class SearchBarModel extends FlutterFlowModel<SearchBarWidget> {
  ///  State fields for stateful widgets in this page.

  // Model for searchBarComp component.
  late SearchBarCompModel searchBarCompModel;

  @override
  void initState(BuildContext context) {
    searchBarCompModel = createModel(context, () => SearchBarCompModel());
  }

  @override
  void dispose() {
    searchBarCompModel.dispose();
  }
}
