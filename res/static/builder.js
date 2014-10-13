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
        nextInput: function() {
            this.props.parent.nextInput(this.props.key);
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
        handleKeypress: function(e) {
            var target = e.target;
            var me = this;

            switch (e.keyCode) {
                case 13: // Enter
                    // Get all possible templates
                    var templates = cmdlib.all();
                    // Filter the templates by return type, if we require one
                    if (this.props.returnType) {
                        templates = templates.filter(cmdlib.byReturnType(this.props.returnType));
                    }

                    templates = templates.filter(function(tmpl) {
                        return tmpl.name.substr(0, target.value.length) === target.value;
                    });

                    if (templates.length) {
                        var tmpl = templates[0];
                        if (target.value === tmpl.name) {
                            this.setTemplate(tmpl, function() {
                                var nextCmd = me.getDOMNode().querySelector('.cmd-wrapper');
                                if (nextCmd) {
                                    nextCmd.querySelector('.cmd-input').focus();
                                } else {
                                    me.props.parent.enter();
                                }
                            });
                        } else {
                            // TODO: trigger error
                        }
                    } else {
                        // TODO: Test input validity as primitive
                        this.setPrimitive(target.value);
                        me.props.parent.enter();
                    }

                    break;

                case 32:

                    break;
                default:
                    //
            }

            setWidth(target);
        },
        render: function() {
            var contents = [];

            var name = this.state.name;


            return React.DOM.div(
                {
                    className: 'cmd-wrapper cmd-' +
                        (this.state.type || 'cmd-unset') +
                        (this.state.args.length ? ' cmd-has-args' : ' cmd-no-args'),
                },
                React.DOM.input({
                    className: 'cmd-input',
                    ref: 'input',
                    onKeyUp: this.handleKeypress,
                    placeholder: this.props.paramName || '',
                }),
                this.state.args.map(function(arg, i) {
                    return CommandNode({
                        parent: this,
                        key: i,
                        returnType: arg.type,
                        paramName: arg.toString(),
                    });
                }, this)
            );
        },
        getValue: function() {
            //
        }
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
