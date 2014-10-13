define('comm', function() {

    var socket = new WebSocket('ws://localhost:4640/ws');

    socket.addEventListener('open', function() {});
    socket.addEventListener('message', function() {});

    return {
        close: function() {
            socket.close();
        },
    };

});
