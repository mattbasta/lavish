library shvm.types;

import 'dart:async';
import 'dart:convert';
import 'dart:io';


class DiskEntry {

    final String path;

    const DiskEntry(this.path);

    String toString() => this.path;
    File toFile() => new File(this.path);

}


class Blob extends Stream<List<int>> {
    Stream<List<int>> _source;
    StreamSubscription<List<int>> _subscription;
    StreamController<List<int>> _controller;

    Blob(Stream<List<int>> source) : _source = source {
        _instantiateController();
    }

    void _instantiateController() {
        _controller = new StreamController<List<int>>(
            onListen: _onListen,
            onPause: _onPause,
            onResume: _onResume,
            onCancel: _onCancel
        );
    }

    Blob.fromDiskEntry(DiskEntry target) {
        _source = target.toFile().openRead();
        _instantiateController();
    }


    StreamSubscription<List<int>> listen(void onData(List<int> data), {void onError(Error error), void onDone(), bool cancelOnError}) {
        return _controller.stream.listen(
            onData,
            onError: onError,
            onDone: onDone,
            cancelOnError: cancelOnError
        );
    }


    void _onListen() {
        _subscription = _source.listen(
            _onData,
            onError: _controller.addError,
            onDone: _onDone
        );
    }

    void _onCancel() {
        _subscription.cancel();
        _subscription = null;
    }

    void _onPause() {
        _subscription.pause();
    }

    void _onResume() {
        _subscription.resume();
    }

    void _onData(List<int> input) {
        _controller.add(input);
    }

    void _onDone() {
        _controller.close();
    }


    Future writeToDiskEntry(DiskEntry target) {
        return this.pipe(target.toFile().openWrite());
    }

    Future appendToDiskEntry(DiskEntry target) {
        return this.pipe(target.toFile().openWrite(mode: FileMode.APPEND));
    }

    Stream<String> toStringStream() {
        return this.transform(UTF8.decoder);
    }

}
