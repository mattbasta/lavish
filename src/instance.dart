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

        switch (input['type']) {
            case 'command':
                Controller ctrl = getController(input['value'], this);
                controllerMap[ctrl.uuid] = ctrl;
                socket.add(JSON.encode({
                    type: 'chan.open',
                    value: ctrl.uuid,
                }));
                break;
        }

    }

    void close() {
        for (var ctrl in controllerMap.values) {
            ctrl.kill();
        }
        controllerMap = null;
    }

    void pushUpdate(String uuid, String blob) {
        socket.add(JSON.encode({
            type: 'chan.pub',
            channel: uuid,
            value: blob,
        }));
    }
    void closeController(String uuid) {
        controllerMap.remove(uuid);
        socket.add(JSON.encode({
            type: 'chan.close',
            value: uuid,
        }));
    }

}
