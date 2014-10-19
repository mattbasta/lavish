library shvm.read;

import 'dart:async';

import '../types.dart' as types;

import '../annotations.dart';
import '../context.dart';


@voidInput()
Future<types.Blob> run(Context context, types.DiskEntry target) {
    return new Future<types.Blob>.value(new types.Blob.fromDiskEntry(target));
}
