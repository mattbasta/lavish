import 'dart:io';

import 'package:mime/mime.dart';

import 'src/instance.dart' as instance;


void main() {

    HttpServer.bind('127.0.0.1', 4640)
        .then((HttpServer server) {
            print('listening for connections on 4640');

            server.listen((HttpRequest request) {
                if (request.uri.path == '/ws') {
                    WebSocketTransformer.upgrade(request).then((WebSocket websocket) {
                        var inst = new instance.Instance(websocket);

                        websocket.listen(
                            inst.handleMessage,
                            onError: inst.close
                        );

                    });
                    return;
                }

                HttpResponse response = request.response;
                // Return static files
                if (request.uri.path.startsWith('/static/')) {
                    if (request.uri.path.contains('..')) {
                        response.statusCode = 404;
                        response.close();
                        return;
                    }

                    String path = 'res' + request.uri.path;
                    response.headers.add(HttpHeaders.CONTENT_TYPE, lookupMimeType(path));
                    new File(path).openRead().pipe(response);
                    return;
                }

                new File('res/index.html').readAsString().then((resp) {
                    response.headers.add(HttpHeaders.CONTENT_TYPE, "text/html");
                    response.write(resp);
                    response.close();
                });
            });
        },
        onError: (error) => print("Error starting HTTP server: $error"));
}
