import '/backend/backend.dart';
import '/components/create_jobs_btn/create_jobs_btn_widget.dart';
import '/components/create_resume_btn/create_resume_btn_widget.dart';
import '/components/dash_board_nav/dash_board_nav_widget.dart';
import '/components/side_nav/side_nav_widget.dart';
import '/components/use_templates_btn/use_templates_btn_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'dashboard_widget.dart' show DashboardWidget;
import 'package:flutter/material.dart';
import 'package:infinite_scroll_pagination/infinite_scroll_pagination.dart';

class DashboardModel extends FlutterFlowModel<DashboardWidget> {
  ///  State fields for stateful widgets in this page.

  // Model for sideNav component.
  late SideNavModel sideNavModel;
  // Model for dashBoardNav component.
  late DashBoardNavModel dashBoardNavModel;
  // Model for createResumeBtn component.
  late CreateResumeBtnModel createResumeBtnModel;
  // State field(s) for ListView widget.

  PagingController<DocumentSnapshot?, ResumesRecord>? listViewPagingController;
  Query? listViewPagingQuery;
  List<StreamSubscription?> listViewStreamSubscriptions = [];

  // Model for createJobsBtn component.
  late CreateJobsBtnModel createJobsBtnModel;
  // Model for useTemplatesBtn component.
  late UseTemplatesBtnModel useTemplatesBtnModel;

  @override
  void initState(BuildContext context) {
    sideNavModel = createModel(context, () => SideNavModel());
    dashBoardNavModel = createModel(context, () => DashBoardNavModel());
    createResumeBtnModel = createModel(context, () => CreateResumeBtnModel());
    createJobsBtnModel = createModel(context, () => CreateJobsBtnModel());
    useTemplatesBtnModel = createModel(context, () => UseTemplatesBtnModel());
  }

  @override
  void dispose() {
    sideNavModel.dispose();
    dashBoardNavModel.dispose();
    createResumeBtnModel.dispose();
    listViewStreamSubscriptions.forEach((s) => s?.cancel());
    listViewPagingController?.dispose();

    createJobsBtnModel.dispose();
    useTemplatesBtnModel.dispose();
  }

  /// Additional helper methods.
  PagingController<DocumentSnapshot?, ResumesRecord> setListViewController(
    Query query, {
    DocumentReference<Object?>? parent,
  }) {
    listViewPagingController ??= _createListViewController(query, parent);
    if (listViewPagingQuery != query) {
      listViewPagingQuery = query;
      listViewPagingController?.refresh();
    }
    return listViewPagingController!;
  }

  PagingController<DocumentSnapshot?, ResumesRecord> _createListViewController(
    Query query,
    DocumentReference<Object?>? parent,
  ) {
    final controller =
        PagingController<DocumentSnapshot?, ResumesRecord>(firstPageKey: null);
    return controller
      ..addPageRequestListener(
        (nextPageMarker) => queryResumesRecordPage(
          queryBuilder: (_) => listViewPagingQuery ??= query,
          nextPageMarker: nextPageMarker,
          streamSubscriptions: listViewStreamSubscriptions,
          controller: controller,
          pageSize: 25,
          isStream: true,
        ),
      );
  }
}
