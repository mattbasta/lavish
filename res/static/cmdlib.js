define('cmdlib', ['types'], function(types) {

    function CommandInterface(name, input, args, output) {
        this.name = name;

        this.input = input || null;
        this.args = args || [];
        this.output = output || null;
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
        new CommandInterface('clear'),
        new CommandInterface('exec', null, [param('command', types.string)]),
        new CommandInterface('pwd'),

        // Sources
        new CommandInterface('ls', null, [param('path', types.DiskEntry)], types['DiskEntry[]']),
        new CommandInterface('read', null, [param('file', types.DiskEntry)], types.Blob),
        new CommandInterface('diff', null, [param('file1', types.DiskEntry), param('file2', types.DiskEntry)], types.Blob),
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
    };
});
