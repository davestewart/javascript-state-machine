if (window.StateMachine && StateMachine.default) {
    window.StateMachine = StateMachine.default;
}

if (window.StateHelper && StateHelper.default) {
    window.StateHelper = StateHelper.default;
}

$(function(){
    $('body').append('<a id="home" href="/">Home</a>');
});

function show(config)
{
    var text = 'transitions: [\n    \'' + config.transitions.join('\',\n    \'') + '\'\n]';
    $('pre:first-of-type').text(text);
}

function setup(fsm)
{
    StateHelper.jQuery(fsm);
    console.log(fsm);
    return fsm;
}

