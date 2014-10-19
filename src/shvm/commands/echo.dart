library shvm.echo;

import 'dart:async';

import '../annotations.dart';
import '../context.dart';


@voidInput()
Future<String> run(Context context, String input) {
    return new Future<String>.value(input);
}
