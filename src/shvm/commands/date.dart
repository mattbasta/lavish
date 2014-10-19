library shvm.date;

import 'dart:async';

import '../annotations.dart';
import '../context.dart';


@voidInput()
Future<DateTime> run(Context context) {
    return new Future<DateTime>.value(new DateTime.now());
}
