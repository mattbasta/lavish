library shvm.uuid;

import 'dart:async';

import 'package:uuid/uuid.dart';

import '../annotations.dart';
import '../context.dart';


@voidInput()
Future<String> run(Context context) {
    return new Future<String>.value(new Uuid().v4());
}
