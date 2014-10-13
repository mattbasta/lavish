part of shvm;


abstract class Task {
    Isolate runner;

    Task() {
        runner = new Isolate();
    }



}
