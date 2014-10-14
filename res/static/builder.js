define('builder', ['cmdlib'], function(cmdlib) {

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    function setWidth(input) {
        var style = window.getComputedStyle(input);
        ctx.font = style.fontSize + ' ' + style.fontFamily;
        var text = input.value || input.placeholder;

        var width = [
            Math.ceil(ctx.measureText(text).width + 20) + 'px',
            style.paddingLeft,
            style.paddingRight,
        ];
        input.style.width = 'calc(' + width.join(' + ') + ')';
    }


    var CommandNode = React.createClass({
        displayName: 'CommandNode',
        componentDidMount: function() {
            setWidth(this.getDOMNode().querySelector('input'));
        },
        enter: function() {
            this.props.parent.enter(this.props.key);
        },
        getInitialState: function() {
            return {
                template: null,
                args: [],
                type: null,
                value: null,
            };
        },
        setTemplate: function(template, cb) {
            var state = {
                template: template,
                args: template.args,
                type: 'template',
                value: null,
            };
            this.setState(state, cb);
        },
        setPrimitive: function(value, cb) {
            var state = {
                template: null,
                args: [],
                type: 'primitive',
                value: value,
            };
            this.setState(state, cb);
        },
        identifyContent: function(target, cb) {
            var me = this;

            // Get all possible templates
            var templates = cmdlib.all();
            // Filter the templates by return type, if we require one
            if (this.props.returnType) {
                templates = templates.filter(cmdlib.byReturnType(this.props.returnType));
            }
            if (this.props.inputType) {
                templates = templates.filter(cmdlib.byInputType(this.props.inputType));
            }

            templates = templates.filter(function(tmpl) {
                return tmpl.name.substr(0, target.value.length) === target.value;
            });

            if (templates.length) {
                var tmpl = templates[0];
                if (target.value === tmpl.name) {
                    this.setTemplate(tmpl, cb);
                    return true;
                } else {
                    // TODO: trigger error
                }
            } else if (!this.isOutputTarget) {
                // TODO: Test input validity as primitive
                this.setPrimitive(target.value, cb);
                return true;
            }
        },
        handleKeyDown: function(e) {
            if (e.keyCode !== 32 || e.target.selectionEnd !== e.target.value.length) {
                return;
            }

            var me = this;

            var result = this.identifyContent(
                e.target,
                function() {
                    // me.nextInput(this.getDOMNode().querySelector('.cmd-input'));
                    me.nextInput(this.refs.input);
                }
            );

            if (!result) {
                this.nextInput(this);
                return;
            }

            e.preventDefault();
        },
        nextInput: function(from) {
            var nextEl;
            if (from.props.next) {
                nextEl = from._owner.refs[from.props.next].getDOMNode();
            } else if (from._owner.refs.output && from._owner.refs.output !== from) {
                nextEl = from._owner.refs.output.getDOMNode();
            }

            if (!nextEl) {
                this._owner.nextInput(this);
                return;
            }

            nextEl.querySelector('.cmd-input').focus();
        },
        handleKeyUp: function(e) {
            switch (e.keyCode) {
                case 13: // Enter
                    this.identifyContent(e.target, function() {
                        this._owner.enter();
                    });
                    break;
            }

            setWidth(e.target);
        },
        render: function() {
            var contents = [];

            var me = this;
            var argNodes = this.state.args.map(function(arg, i) {
                return CommandNode({
                    parent: this,
                    key: i,
                    returnType: arg.type,
                    paramName: arg.toString(),

                    prev: me.state.args[i - 1] ? 'arg' + (i - 1) : null,
                    next: me.state.args[i + 1] ? 'arg' + (i + 1) : null,
                    ref: 'arg' + i,
                });
            }, this);

            var outputNode;
            if (this.state.type === 'template' && this.state.template.output) {
                outputNode = React.DOM.div(
                    {className: 'cmd-target'},
                    CommandNode({
                        parent: this,
                        returnType: this.props.returnType,
                        inputType: this.state.template.output,

                        isOutputTarget: true,

                        ref: 'output',
                    })
                );
            }

            return React.DOM.div(
                {className: 'cmd-sub-wrapper'},
                React.DOM.div(
                    {
                        className: 'cmd-wrapper cmd-' +
                            (this.state.type || 'unset') +
                            (this.state.args.length ? ' cmd-has-args' : ' cmd-no-args')
                    },
                    React.DOM.input({
                        className: 'cmd-input',
                        ref: 'input',
                        onKeyDown: this.handleKeyDown,
                        onKeyUp: this.handleKeyUp,
                        placeholder: this.props.paramName || '',
                        next: argNodes.length ? 'arg0' : null,
                    }),
                    argNodes
                ),
                outputNode
            );
        },
    });

    var Builder = React.createClass({
        displayName: 'Builder',
        nextInput: function() {},
        enter: function() {
            console.log('enter');
        },
        render: function() {
            return React.DOM.div(
                null,
                CommandNode({
                    parent: this,
                })
            );
        }
    });

    React.renderComponent(
        Builder(null),
        document.querySelector('.builder')
    );

});
