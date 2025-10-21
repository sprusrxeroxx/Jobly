import '/flutter_flow/flutter_flow_util.dart';
import 'dash_board_nav_widget.dart' show DashBoardNavWidget;
import 'package:flutter/material.dart';

class DashBoardNavModel extends FlutterFlowModel<DashBoardNavWidget> {
  ///  State fields for stateful widgets in this component.

  // State field(s) for PageView widget.
  PageController? pageViewController;

  int get pageViewCurrentIndex => pageViewController != null &&
          pageViewController!.hasClients &&
          pageViewController!.page != null
      ? pageViewController!.page!.round()
      : 0;

  @override
  void initState(BuildContext context) {}

  @override
  void dispose() {}
}
