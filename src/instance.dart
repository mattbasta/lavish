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
        Controller ctrl = getController(JSON.decode(message), this);
        controllerMap[ctrl.uuid] = ctrl;
    }

    void close() {
        for (var ctrl in controllerMap.values) {
            ctrl.kill();
        }
        controllerMap = null;
    }

    void pushUpdate(String uuid, String blob) {
        socket.add(blob);
    }
    void closeController(String uuid) {
        controllerMap.remove(uuid);
    }

}
