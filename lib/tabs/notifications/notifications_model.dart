import '/components/notifications_comp/notifications_comp_widget.dart';
import '/components/side_nav/side_nav_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'notifications_widget.dart' show NotificationsWidget;
import 'package:flutter/material.dart';

class NotificationsModel extends FlutterFlowModel<NotificationsWidget> {
  ///  State fields for stateful widgets in this page.

  // Model for sideNav component.
  late SideNavModel sideNavModel;
  // Model for notificationsComp component.
  late NotificationsCompModel notificationsCompModel;

  @override
  void initState(BuildContext context) {
    sideNavModel = createModel(context, () => SideNavModel());
    notificationsCompModel =
        createModel(context, () => NotificationsCompModel());
  }

  @override
  void dispose() {
    sideNavModel.dispose();
    notificationsCompModel.dispose();
  }
}
