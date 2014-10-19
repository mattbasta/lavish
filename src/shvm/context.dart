library shvm.context;

import 'dart:async';

import 'instancecoordinator.dart';


class Context {
    final InstanceCoordinator instance;
    final Future inputFuture;

    const Context(this.instance, this.inputFuture);
}
