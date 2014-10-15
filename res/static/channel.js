define('channel', function() {

    var id = 0;
    function nextID() {
        return ++id;
    }

    function Channel(uuid) {
        this.uuid = uuid;
        this.listeners = [];
        this.closeListeners = [];
    }

    Channel.prototype.listen = function(cb, closeCb) {
        this.listeners.push(cb);
        this.closeListeners.push(cb);
    };

    Channel.prototype.write = function(data) {
        this.listeners.forEach(function(listener) {
            listener(data);
        });
    };

    Channel.prototype.close = function() {
        this.listeners = [];
        this.closeListeners.forEach(function(listener) {listener();});
        this.closeListeners = [];
    };

    return {
        Channel: Channel,
    };
});
