library instance;

import 'dart:convert';
import 'dart:io';

import 'shvm/controller.dart';


class Instance implements InstanceCoordinator {

    Map<String, Controller> controllerMap;
    Directory cwd;

    WebSocket socket;

    Instance(WebSocket socket) {
        this.controllerMap = new Map<String, Controller>();
        this.cwd = Directory.current;
        this.socket = socket;
    }

    void handleMessage(message) {
        var input = JSON.decode(message);
        controllerMap[uuid] = getController(input);
    }

    void close() {
        for (var ctrl in controllerMap.values) {
            ctrl.kill();
        }
        controllerMap = null;
    }

}
