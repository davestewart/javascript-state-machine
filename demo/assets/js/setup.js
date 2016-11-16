if (window.StateMachine && StateMachine.default) {
    window.StateMachine = StateMachine.default;
}

if (window.StateHelper && StateHelper.default) {
    window.StateHelper = StateHelper.default;
}

/**
 * Iniialisation function
 */
function init ()
{
    // create simple page navigation
    var depth = location.pathname.substr(1).split('/').length
    var href = depth === 3
        ? '../../index.html'
        :'../index.html';
    var text = depth === 3
        ? 'Home'
        : 'Menu';
    $('body').append('<a id="home" href="' +href+ '">' +text+ '</a>');
}

/**
 * Utility function to show transitions config
 *
 * @param   {Object}    config
 */
function show (config)
{
    var text = 'transitions: [\n    ' + config.transitions
        .map(function(tx){ return JSON.stringify(tx); })
        .join(',\n    ') + '\n]';
    $('pre:first-of-type').text(text);
}

/**
 * Helper function to set up jQueryHelepr
 *
 * @param   {StateMachine}  fsm
 * @returns {jQueryHelper}
 */
function setup (fsm)
{
    console.log(fsm);
    return window.helper = StateHelper.jQuery(fsm);
}

$(init);
