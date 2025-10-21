import '/flutter_flow/flutter_flow_animations.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/index.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'create_resume_btn_model.dart';
export 'create_resume_btn_model.dart';

class CreateResumeBtnWidget extends StatefulWidget {
  const CreateResumeBtnWidget({super.key});

  @override
  State<CreateResumeBtnWidget> createState() => _CreateResumeBtnWidgetState();
}

class _CreateResumeBtnWidgetState extends State<CreateResumeBtnWidget>
    with TickerProviderStateMixin {
  late CreateResumeBtnModel _model;

  var hasIconTriggered = false;
  var hasTextTriggered = false;
  final animationsMap = <String, AnimationInfo>{};

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => CreateResumeBtnModel());

    animationsMap.addAll({
      'iconOnActionTriggerAnimation': AnimationInfo(
        trigger: AnimationTrigger.onActionTrigger,
        applyInitialState: false,
        effectsBuilder: () => [
          ScaleEffect(
            curve: Curves.elasticOut,
            delay: 90.0.ms,
            duration: 600.0.ms,
            begin: Offset(-1.0, -1.0),
            end: Offset(1.0, 1.0),
          ),
        ],
      ),
      'textOnActionTriggerAnimation': AnimationInfo(
        trigger: AnimationTrigger.onActionTrigger,
        applyInitialState: false,
        effectsBuilder: () => [
          ScaleEffect(
            curve: Curves.elasticOut,
            delay: 190.0.ms,
            duration: 600.0.ms,
            begin: Offset(-1.0, -1.0),
            end: Offset(1.0, 1.0),
          ),
        ],
      ),
    });
    setupAnimations(
      animationsMap.values.where((anim) =>
          anim.trigger == AnimationTrigger.onActionTrigger ||
          !anim.applyInitialState),
      this,
    );

    WidgetsBinding.instance.addPostFrameCallback((_) => safeSetState(() {}));
  }

  @override
  void dispose() {
    _model.maybeDispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Opacity(
      opacity: 0.7,
      child: Container(
        width: double.infinity,
        height: 100.0,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(4.0),
          shape: BoxShape.rectangle,
          border: Border.all(
            color: FlutterFlowTheme.of(context).alternate,
          ),
        ),
        child: MouseRegion(
          opaque: false,
          cursor: SystemMouseCursors.basic ?? MouseCursor.defer,
          child: Column(
            mainAxisSize: MainAxisSize.max,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              InkWell(
                splashColor: Colors.transparent,
                focusColor: Colors.transparent,
                hoverColor: Colors.transparent,
                highlightColor: Colors.transparent,
                onTap: () async {
                  context.pushNamed(
                    CreateResumePgWidget.routeName,
                    extra: <String, dynamic>{
                      kTransitionInfoKey: TransitionInfo(
                        hasTransition: true,
                        transitionType: PageTransitionType.fade,
                      ),
                    },
                  );
                },
                child: Icon(
                  Icons.add_box,
                  color: FlutterFlowTheme.of(context).primaryText,
                  size: 20.0,
                ),
              ).animateOnActionTrigger(
                  animationsMap['iconOnActionTriggerAnimation']!,
                  hasBeenTriggered: hasIconTriggered),
              Align(
                alignment: AlignmentDirectional(0.0, 0.0),
                child: Padding(
                  padding: EdgeInsets.all(6.0),
                  child: Text(
                    'Create Resume',
                    textAlign: TextAlign.center,
                    style: FlutterFlowTheme.of(context).bodyMedium.override(
                          font: GoogleFonts.manrope(
                            fontWeight: FlutterFlowTheme.of(context)
                                .bodyMedium
                                .fontWeight,
                            fontStyle: FlutterFlowTheme.of(context)
                                .bodyMedium
                                .fontStyle,
                          ),
                          color: FlutterFlowTheme.of(context).secondaryText,
                          fontSize: () {
                            if (MediaQuery.sizeOf(context).width <
                                kBreakpointSmall) {
                              return 9.0;
                            } else if (MediaQuery.sizeOf(context).width <
                                kBreakpointMedium) {
                              return 14.0;
                            } else if (MediaQuery.sizeOf(context).width <
                                kBreakpointLarge) {
                              return 14.0;
                            } else {
                              return 14.0;
                            }
                          }(),
                          letterSpacing: 0.0,
                          fontWeight: FlutterFlowTheme.of(context)
                              .bodyMedium
                              .fontWeight,
                          fontStyle:
                              FlutterFlowTheme.of(context).bodyMedium.fontStyle,
                        ),
                  ).animateOnActionTrigger(
                      animationsMap['textOnActionTriggerAnimation']!,
                      hasBeenTriggered: hasTextTriggered),
                ),
              ),
            ],
          ),
          onEnter: ((event) async {
            safeSetState(() => _model.mouseRegionHovered = true);
            if (animationsMap['iconOnActionTriggerAnimation'] != null) {
              safeSetState(() => hasIconTriggered = true);
              SchedulerBinding.instance.addPostFrameCallback((_) async =>
                  animationsMap['iconOnActionTriggerAnimation']!
                      .controller
                      .forward(from: 0.0));
            }
            if (animationsMap['textOnActionTriggerAnimation'] != null) {
              safeSetState(() => hasTextTriggered = true);
              SchedulerBinding.instance.addPostFrameCallback((_) async =>
                  animationsMap['textOnActionTriggerAnimation']!
                      .controller
                      .forward(from: 0.0));
            }
          }),
          onExit: ((event) async {
            safeSetState(() => _model.mouseRegionHovered = false);
          }),
        ),
      ),
    );
  }
}
