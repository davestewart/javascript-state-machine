if (window.StateMachine && StateMachine.default) {
    window.StateMachine = StateMachine.default;
}

if (window.StateHelper && StateHelper.default) {
    window.StateHelper = StateHelper.default;
}

function init ()
{
    var depth = location.pathname.substr(1).split('/').length
    var href = depth === 3
        ? '../../index.html'
        :'../index.html';
    var text = depth === 3
        ? 'Home'
        : 'Menu';
    $('body').append('<a id="home" href="' +href+ '">' +text+ '</a>');
}

function show (config)
{
    var text = 'transitions: [\n    \'' + config.transitions.join('\',\n    \'') + '\'\n]';
    $('pre:first-of-type').text(text);
}

function setup (fsm)
{
    StateHelper.jQuery(fsm);
    console.log(fsm);
    return fsm;
}

$(init);
