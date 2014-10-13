library instance;

import 'dart:convert';
import 'dart:io';

import 'shvm/controller.dart';


class Instance {

    Map<String, Controller> controllerMap;
    Directory cwd;

    Instance() {
        this.controllerMap = new Map<String, Controller>();
        cwd = Directory.current;
    }

    void handleMessage(message) {
        var input = JSON.decode(message);



    }

    void close() {
        for (var ctrl in controllerMap.values) {
            ctrl.kill();
        }
        controllerMap = null;
    }

}
