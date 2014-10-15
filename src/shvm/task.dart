part of shvm;


class Task {
    Future<Isolate> runner;
    ReceivePort response;

    Task(Uri uri) {
        this.response = new ReceivePort();

        this.response.listen(this.responseHandler)

        this.runner = Isolate.spawnUri(uri, [], this.response.sendPort);
    }

    void responseHandler(msg) {
        //
    }

}
