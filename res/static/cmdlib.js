define('cmdlib', ['types'], function(types) {

    function CommandInterface(name, input, args, output) {
        this.name = name;

        this.input = input || types['void'];
        this.args = args || [];
        this.output = output || types['void'];
    }

    function CommandParameter(name, type) {
        this.name = name;
        this.type = type;

        this.toString = function() {
            return this.name + ' (' + this.type.toString() + ')';
        };
    }

    function param(name, type) {
        return new CommandParameter(name, type);
    }

    var commands = [
        // Statements
        new CommandInterface('cd', null, [param('path', types.string)]),
        new CommandInterface('cp', null, [param('source', types.DiskEntry), param('destination', types.string)]),
        new CommandInterface('clear'),
        new CommandInterface('exec', null, [param('command', types.string)]),
        new CommandInterface('mkdir', null, [param('target', types.DiskEntry)]),
        new CommandInterface('mv', null, [param('source', types.DiskEntry), param('destination', types.string)]),
        new CommandInterface('pwd', null, null, types.DiskEntry),
        new CommandInterface('rm', null, [param('target', types.DiskEntry)]),
        new CommandInterface('rmdir', null, [param('target', types.DiskEntry)]),
        new CommandInterface('touch', null, [param('target', types.DiskEntry)]),
        new CommandInterface('uuid', null, null, types.string),

        // Sources
        new CommandInterface('curl', null, [param('uri', types.string)], types.Blob),
        new CommandInterface('date', null, null, types.Date),
        new CommandInterface('diff', null, [param('file1', types.DiskEntry), param('file2', types.DiskEntry)], types.Blob),
        new CommandInterface('echo', null, [param('data', types.string)], types.string),
        new CommandInterface('ls', null, [param('path', types.DiskEntry)], types['DiskEntry[]']),
        new CommandInterface('read', null, [param('file', types.DiskEntry)], types.Blob),
        new CommandInterface('wc', types.Blob, [param('char', types.string)], types.num),
        new CommandInterface('write', types.Blob, [param('target', types.DiskEntry)]),

        // Filters
        new CommandInterface('gunzip', types.Blob, null, types.Blob),
        new CommandInterface('gzip', types.Blob, null, types.Blob),
        new CommandInterface('hash', types.Blob, [param('algo', types.string)], types.string),
        new CommandInterface('lines', types.Blob, null, types['string[]']),
    ];

    return {
        all: function() {
            return commands;
        },
        byReturnType: function(type) {
            return function(cmd) {
                return cmd.output === type;
            };
        },
        byInputType: function(type) {
            return function(cmd) {
                return cmd.input === type;
            };
        },
    };
});
