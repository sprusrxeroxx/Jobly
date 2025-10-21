import '/backend/api_requests/api_calls.dart';
import '/components/job_description_mod/job_description_mod_widget.dart';
import '/components/old_resume_mod/old_resume_mod_widget.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import '/index.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart'
    as smooth_page_indicator;
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:google_fonts/google_fonts.dart';
import 'create_resume_pg_model.dart';
export 'create_resume_pg_model.dart';

class CreateResumePgWidget extends StatefulWidget {
  const CreateResumePgWidget({super.key});

  static String routeName = 'createResumePg';
  static String routePath = '/createResumePg';

  @override
  State<CreateResumePgWidget> createState() => _CreateResumePgWidgetState();
}

class _CreateResumePgWidgetState extends State<CreateResumePgWidget> {
  late CreateResumePgModel _model;

  final scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => CreateResumePgModel());

    WidgetsBinding.instance.addPostFrameCallback((_) => safeSetState(() {}));
  }

  @override
  void dispose() {
    _model.dispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        FocusScope.of(context).unfocus();
        FocusManager.instance.primaryFocus?.unfocus();
      },
      child: PopScope(
        canPop: false,
        child: Scaffold(
          key: scaffoldKey,
          backgroundColor: FlutterFlowTheme.of(context).primaryBackground,
          body: SafeArea(
            top: true,
            child: Container(
              decoration: BoxDecoration(
                color: FlutterFlowTheme.of(context).secondaryBackground,
              ),
              child: Padding(
                padding: EdgeInsets.all(4.0),
                child: Container(
                  width: double.infinity,
                  height: () {
                    if (MediaQuery.sizeOf(context).width < kBreakpointSmall) {
                      return (MediaQuery.sizeOf(context).height * 0.95);
                    } else if (MediaQuery.sizeOf(context).width <
                        kBreakpointLarge) {
                      return MediaQuery.sizeOf(context).height;
                    } else {
                      return MediaQuery.sizeOf(context).height;
                    }
                  }(),
                  child: Stack(
                    children: [
                      PageView(
                        controller: _model.pageViewController ??=
                            PageController(initialPage: 0),
                        scrollDirection: Axis.vertical,
                        children: [
                          Align(
                            alignment: AlignmentDirectional(0.0, -1.0),
                            child: Padding(
                              padding: EdgeInsets.all(6.0),
                              child: Column(
                                mainAxisSize: MainAxisSize.max,
                                mainAxisAlignment: MainAxisAlignment.start,
                                children: [
                                  Expanded(
                                    child: Align(
                                      alignment: AlignmentDirectional(0.0, 1.0),
                                      child: wrapWithModel(
                                        model: _model.oldResumeModModel,
                                        updateCallback: () =>
                                            safeSetState(() {}),
                                        child: OldResumeModWidget(),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                          Padding(
                            padding: EdgeInsets.all(6.0),
                            child: Column(
                              mainAxisSize: MainAxisSize.max,
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                wrapWithModel(
                                  model: _model.jobDescriptionModModel,
                                  updateCallback: () => safeSetState(() {}),
                                  child: JobDescriptionModWidget(
                                    currentJobDescription: '',
                                  ),
                                ),
                                Container(
                                  width: MediaQuery.sizeOf(context).width,
                                  height: 150.0,
                                  decoration: BoxDecoration(
                                    color: FlutterFlowTheme.of(context)
                                        .secondaryBackground,
                                  ),
                                  child: Column(
                                    mainAxisSize: MainAxisSize.max,
                                    children: [
                                      Padding(
                                        padding: EdgeInsets.all(14.0),
                                        child: FFButtonWidget(
                                          onPressed: () async {
                                            await _model.pageViewController
                                                ?.previousPage(
                                              duration:
                                                  Duration(milliseconds: 300),
                                              curve: Curves.ease,
                                            );
                                          },
                                          text: 'Resume',
                                          icon: Icon(
                                            Icons.arrow_back_ios,
                                            size: 15.0,
                                          ),
                                          options: FFButtonOptions(
                                            width: MediaQuery.sizeOf(context)
                                                    .width *
                                                () {
                                                  if (MediaQuery.sizeOf(context)
                                                          .width <
                                                      kBreakpointSmall) {
                                                    return MediaQuery.sizeOf(
                                                            context)
                                                        .width;
                                                  } else if (MediaQuery.sizeOf(
                                                              context)
                                                          .width <
                                                      kBreakpointLarge) {
                                                    return MediaQuery.sizeOf(
                                                            context)
                                                        .width;
                                                  } else {
                                                    return MediaQuery.sizeOf(
                                                            context)
                                                        .width;
                                                  }
                                                }(),
                                            height: 40.0,
                                            padding:
                                                EdgeInsetsDirectional.fromSTEB(
                                                    16.0, 0.0, 16.0, 0.0),
                                            iconPadding:
                                                EdgeInsetsDirectional.fromSTEB(
                                                    0.0, 0.0, 0.0, 0.0),
                                            color: FlutterFlowTheme.of(context)
                                                .secondaryText,
                                            textStyle:
                                                FlutterFlowTheme.of(context)
                                                    .titleSmall
                                                    .override(
                                                      font: GoogleFonts.manrope(
                                                        fontWeight:
                                                            FlutterFlowTheme.of(
                                                                    context)
                                                                .titleSmall
                                                                .fontWeight,
                                                        fontStyle:
                                                            FlutterFlowTheme.of(
                                                                    context)
                                                                .titleSmall
                                                                .fontStyle,
                                                      ),
                                                      color: Colors.white,
                                                      letterSpacing: 0.0,
                                                      fontWeight:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .titleSmall
                                                              .fontWeight,
                                                      fontStyle:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .titleSmall
                                                              .fontStyle,
                                                    ),
                                            elevation: 0.0,
                                            borderRadius:
                                                BorderRadius.circular(8.0),
                                          ),
                                        ),
                                      ),
                                      Opacity(
                                        opacity: 0.8,
                                        child: Padding(
                                          padding: EdgeInsets.all(14.0),
                                          child: FFButtonWidget(
                                            onPressed: ((_model
                                                                .oldResumeModModel
                                                                .resumeTextFieldTextController
                                                                .text ==
                                                            '') ||
                                                    (_model
                                                                .jobDescriptionModModel
                                                                .jobDescTextFieldTextController
                                                                .text ==
                                                            ''))
                                                ? null
                                                : () async {
                                                    _model.isLoading = true;
                                                    safeSetState(() {});
                                                    _model.apiResultbjj =
                                                        await ImproveResumeCall
                                                            .call(
                                                      resume: _model
                                                          .oldResumeModModel
                                                          .resumeTextFieldTextController
                                                          .text,
                                                      jobDescription: _model
                                                          .jobDescriptionModModel
                                                          .jobDescTextFieldTextController
                                                          .text,
                                                    );

                                                    if ((_model.apiResultbjj
                                                            ?.succeeded ??
                                                        true)) {
                                                      _model.htmlResume =
                                                          getJsonField(
                                                        (_model.apiResultbjj
                                                                ?.jsonBody ??
                                                            ''),
                                                        r'''$.htmlResume''',
                                                      ).toString();
                                                      _model.originalResume =
                                                          valueOrDefault<
                                                              String>(
                                                        _model
                                                            .oldResumeModModel
                                                            .resumeTextFieldTextController
                                                            .text,
                                                        '\"\"',
                                                      );
                                                      _model.jobDescription =
                                                          valueOrDefault<
                                                              String>(
                                                        _model
                                                            .jobDescriptionModModel
                                                            .jobDescTextFieldTextController
                                                            .text,
                                                        '\"\"',
                                                      );
                                                      _model.feedback =
                                                          (getJsonField(
                                                        (_model.apiResultbjj
                                                                ?.jsonBody ??
                                                            ''),
                                                        r'''$.feedbackHistory[1].critique.reasons''',
                                                        true,
                                                      ) as List?)!
                                                              .map<String>((e) =>
                                                                  e.toString())
                                                              .toList()
                                                              .cast<String>()
                                                              .toList()
                                                              .cast<String>();
                                                      _model.structuredResume =
                                                          getJsonField(
                                                        (_model.apiResultbjj
                                                                ?.jsonBody ??
                                                            ''),
                                                        r'''$.structuredData''',
                                                      );
                                                      _model.isLoading = false;
                                                      safeSetState(() {});

                                                      context.pushNamed(
                                                        ViewResumePgWidget
                                                            .routeName,
                                                        queryParameters: {
                                                          'improvedResume':
                                                              serializeParam(
                                                            _model.htmlResume,
                                                            ParamType.String,
                                                          ),
                                                          'jobDescription':
                                                              serializeParam(
                                                            valueOrDefault<
                                                                String>(
                                                              _model
                                                                  .jobDescriptionModModel
                                                                  .jobDescTextFieldTextController
                                                                  .text,
                                                              '\"\"',
                                                            ),
                                                            ParamType.String,
                                                          ),
                                                          'originalResume':
                                                              serializeParam(
                                                            _model
                                                                .originalResume,
                                                            ParamType.String,
                                                          ),
                                                          'htmlResponse':
                                                              serializeParam(
                                                            _model.htmlResume,
                                                            ParamType.String,
                                                          ),
                                                          'feedback':
                                                              serializeParam(
                                                            _model.feedback,
                                                            ParamType.String,
                                                            isList: true,
                                                          ),
                                                        }.withoutNulls,
                                                        extra: <String,
                                                            dynamic>{
                                                          kTransitionInfoKey:
                                                              TransitionInfo(
                                                            hasTransition: true,
                                                            transitionType:
                                                                PageTransitionType
                                                                    .fade,
                                                          ),
                                                        },
                                                      );
                                                    } else {
                                                      _model.isLoading = false;
                                                      safeSetState(() {});
                                                      ScaffoldMessenger.of(
                                                              context)
                                                          .showSnackBar(
                                                        SnackBar(
                                                          content: Text(
                                                            'API error: \${API Call Error Message}',
                                                            style: TextStyle(
                                                              color: FlutterFlowTheme
                                                                      .of(context)
                                                                  .primaryText,
                                                            ),
                                                          ),
                                                          duration: Duration(
                                                              milliseconds:
                                                                  4000),
                                                          backgroundColor:
                                                              FlutterFlowTheme.of(
                                                                      context)
                                                                  .secondary,
                                                        ),
                                                      );
                                                    }

                                                    safeSetState(() {});
                                                  },
                                            text: 'Generate',
                                            icon: FaIcon(
                                              FontAwesomeIcons.ghost,
                                              size: 15.0,
                                            ),
                                            options: FFButtonOptions(
                                              width: MediaQuery.sizeOf(context)
                                                      .width *
                                                  () {
                                                    if (MediaQuery.sizeOf(
                                                                context)
                                                            .width <
                                                        kBreakpointSmall) {
                                                      return MediaQuery.sizeOf(
                                                              context)
                                                          .width;
                                                    } else if (MediaQuery
                                                                .sizeOf(context)
                                                            .width <
                                                        kBreakpointLarge) {
                                                      return MediaQuery.sizeOf(
                                                              context)
                                                          .width;
                                                    } else {
                                                      return MediaQuery.sizeOf(
                                                              context)
                                                          .width;
                                                    }
                                                  }(),
                                              height: 40.0,
                                              padding: EdgeInsetsDirectional
                                                  .fromSTEB(
                                                      16.0, 0.0, 16.0, 0.0),
                                              iconPadding: EdgeInsetsDirectional
                                                  .fromSTEB(0.0, 0.0, 0.0, 0.0),
                                              color: Color(0xC81E147F),
                                              textStyle:
                                                  FlutterFlowTheme.of(context)
                                                      .titleSmall
                                                      .override(
                                                        font:
                                                            GoogleFonts.manrope(
                                                          fontWeight:
                                                              FlutterFlowTheme.of(
                                                                      context)
                                                                  .titleSmall
                                                                  .fontWeight,
                                                          fontStyle:
                                                              FlutterFlowTheme.of(
                                                                      context)
                                                                  .titleSmall
                                                                  .fontStyle,
                                                        ),
                                                        color: Colors.white,
                                                        letterSpacing: 0.0,
                                                        fontWeight:
                                                            FlutterFlowTheme.of(
                                                                    context)
                                                                .titleSmall
                                                                .fontWeight,
                                                        fontStyle:
                                                            FlutterFlowTheme.of(
                                                                    context)
                                                                .titleSmall
                                                                .fontStyle,
                                                      ),
                                              elevation: 0.0,
                                              borderRadius:
                                                  BorderRadius.circular(8.0),
                                              disabledColor:
                                                  FlutterFlowTheme.of(context)
                                                      .primary,
                                            ),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      Align(
                        alignment: AlignmentDirectional(1.0, 0.0),
                        child: smooth_page_indicator.SmoothPageIndicator(
                          controller: _model.pageViewController ??=
                              PageController(initialPage: 0),
                          count: 2,
                          axisDirection: Axis.vertical,
                          onDotClicked: (i) async {
                            await _model.pageViewController!.animateToPage(
                              i,
                              duration: Duration(milliseconds: 500),
                              curve: Curves.ease,
                            );
                            safeSetState(() {});
                          },
                          effect: smooth_page_indicator.SlideEffect(
                            spacing: 8.0,
                            radius: 8.0,
                            dotWidth: 8.0,
                            dotHeight: 8.0,
                            dotColor: FlutterFlowTheme.of(context).accent1,
                            activeDotColor:
                                FlutterFlowTheme.of(context).primary,
                            paintStyle: PaintingStyle.fill,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
