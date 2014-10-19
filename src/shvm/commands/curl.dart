library shvm.read;

import 'dart:async';
import 'dart:io';

import '../types.dart' as types;

import '../annotations.dart';
import '../context.dart';


@voidInput()
Future<types.Blob> run(Context context, String target) {
    var completer = new Completer<types.Blob>();

    var url = Uri.parse(target);
    var httpClient = new HttpClient();

    httpClient.getUrl(url)
        .then((HttpClientRequest request) => request.close())
        .then((HttpClientResponse response) {
            var blob = new types.Blob(response);
            blob.
            completer.complete(blob);

            response.transform(UTF8.decoder).toList().then((data) {
                var body = data.join('');
                print(body);
                httpClient.close();
            });
    });

    return completer.future;
}
