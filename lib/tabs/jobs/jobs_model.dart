import '/components/search_bar_comp/search_bar_comp_widget.dart';
import '/components/side_nav/side_nav_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'jobs_widget.dart' show JobsWidget;
import 'package:flutter/material.dart';

class JobsModel extends FlutterFlowModel<JobsWidget> {
  ///  Local state fields for this page.
  /// Counts the number of Jobs returned
  int? jobsAvailableCount = 0;

  ///  State fields for stateful widgets in this page.

  // Model for sideNav component.
  late SideNavModel sideNavModel;
  // Model for searchBarComp component.
  late SearchBarCompModel searchBarCompModel;

  @override
  void initState(BuildContext context) {
    sideNavModel = createModel(context, () => SideNavModel());
    searchBarCompModel = createModel(context, () => SearchBarCompModel());
  }

  @override
  void dispose() {
    sideNavModel.dispose();
    searchBarCompModel.dispose();
  }
}
