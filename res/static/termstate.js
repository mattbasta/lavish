define('termstate', ['comm'], function(comm) {

    var results = [];

    function BlobStream() {
        this.parts = [];
    }
    BlobStream.prototype.write = function(data) {
        this.parts.push(data);
    };

    function Result(chan) {
        this.active = true;
        this.chan = chan;
        this.type = null;
        this.stderr = new BlobStream();


        var me = this;
        chan.listen(function(data) {
            //
        }, function() {
            me.active = false;
            me.chan = null;
        });
    }
    Result.prototype.close = function() {
        if (!this.chan) {
            return;
        }
        comm.write('chan.close', this.chan.uuid);
        this.chan.close();
    };


    comm.on('chan.open', function(chan) {
        results.push(new Result(chan));
    });

    return {
        getState: function() {
            return results;
        },
        clear: function() {
            results.forEach(function(result) {
                if (!result.active) {
                    return;
                }
                result.close();
            });
            results = [];
        },
    };
});
