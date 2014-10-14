library shvm;

import 'dart:async';
import 'dart:io';
import 'dart:isolate';

import 'package:uuid/uuid.dart';

part 'task.dart';


abstract class InstanceCoordinator {
    void pushUpdate(String uuid, String blob);
    void closeController(String uuid);
}


Controller getController(instruction, InstanceCoordinator inst) {
    var uuid = new Uuid().v4();

    var ctrl = new Controller(uuid, inst);
    ctrl.run(input);
    return ctrl;
}


class Controller {

    String uuid;
    InstanceCoordinator coord;

    Controller(uuid, coord);

    void run(instruction) {
        // Type checking
        //
    }

    void push(String blob) {
        this.coord.pushUpdate(this.uuid, blob);
    }

    void kill() {
        this.coord.closeController(this.uuid);
    }
}
