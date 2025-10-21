import 'package:flutter/material.dart';

class FFFocusableActionDetector extends StatefulWidget {
  final Widget child;
  final void Function(bool hasFocus) onShowFocusHighlight;
  final Border? border;
  final BorderRadius? borderRadius;

  const FFFocusableActionDetector({
    super.key,
    required this.child,
    required this.onShowFocusHighlight,
    this.border,
    this.borderRadius,
  });

  @override
  State<FFFocusableActionDetector> createState() =>
      _FFFocusableActionDetectorState();
}

class _FFFocusableActionDetectorState extends State<FFFocusableActionDetector> {
  bool _hasFocus = false;

  @override
  Widget build(BuildContext context) {
    return FocusableActionDetector(
      onShowFocusHighlight: (hasFocus) {
        setState(() => _hasFocus = hasFocus);
        widget.onShowFocusHighlight(hasFocus);
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        decoration: BoxDecoration(
          border: _hasFocus ? widget.border : null,
          borderRadius: widget.borderRadius,
        ),
        child: widget.child,
      ),
    );
  }
}
