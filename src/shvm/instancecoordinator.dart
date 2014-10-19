library instancecoodinator;


abstract class InstanceCoordinator {
    void pushUpdate(String uuid, String blob);
    void closeController(String uuid);
}
