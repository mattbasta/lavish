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
            if (e.keyCode === 13) { // Enter
                this.identifyContent(e.target, function() {
                    this._owner.enter();
                });
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
                    placeholder: arg.toString(),

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
                        placeholder: this.state.template.output.toString(),

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
                        placeholder: this.props.placeholder || '',
                        next: argNodes.length ? 'arg0' : null,
                    }),
                    argNodes
                ),
                outputNode
            );
        },
        getValue: function() {
            if (this.state.type === 'primitive') {
                return this.state.value;
            } else if (this.state.type === null) {
                return null;
            }

            var refs = this.refs;
            return {
                name: this.state.template.name,
                args: this.state.args.map(function(arg, i) {
                    return refs['arg' + i].getValue();
                }),
                output: refs.output ? refs.output.getValue() : null,
            };
        },
    });

    var Builder = React.createClass({
        displayName: 'Builder',
        nextInput: function() {},
        enter: function() {
            console.log('enter');
            debugger;
            console.log(this.refs.base.getValue());
        },
        render: function() {
            return React.DOM.div(
                null,
                CommandNode({
                    parent: this,
                    ref: 'base',
                })
            );
        }
    });

    React.renderComponent(
        Builder(null),
        document.querySelector('.builder')
    );

});
