function onPause(event)
{
    // assign paused
    $states
        .toggleClass('paused', _fsm.isPaused());

    // update buttons
    event && updateButtons();
}

function onChange(event) {

    // assign state
    $states
        .attr('data-state', _fsm.state);

    // assign active class to the current state
    $states
        .find(_state)
        .removeClass('active')
        .filter('#'  + _fsm.state)
        .addClass('active');

    // update buttons
    event && updateButtons();
}

function updateButtons()
{
    $controls
        .find(_control)
        .each(function(i, e){
            e.disabled = ! _fsm.canDo(e.name) || _fsm.isPaused();
        });
}

function update()
{
    onPause();
    onChange();
    updateButtons();
}

var _fsm,
    $states,
    $controls,
    _states,
    _controls,
    _state,
    _control;

export default function setup(fsm, states, controls, state, control) {

    // parameters
    _fsm            = fsm;
    _states         = states    || '#states';
    _controls       = controls  || '#controls';
    _state          = state     || '[id]';
    _control        = control   || '[name]';

    // elements
    $states         = $(_states);
    $controls       = $(_controls);

    // live-bind button clicks to fsm actions
    $controls.on('click', _control, function (event) {
        fsm.do(event.target.name);
    });

    // bind event handlers
    fsm
        .on('change', onChange)
        .on('pause', onPause)
        .on('resume', onPause);

    // update
    update();

    // return
    return fsm;
}
