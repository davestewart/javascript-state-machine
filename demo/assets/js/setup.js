if (window.StateMachine) {
    window.StateMachine = StateMachine.default;
}

var fsm, $states, $controls, $buttons;

function update() {

    // assign state and paused
    $states
        .attr('data-state', fsm.state)
        .toggleClass('paused', fsm.isPaused());

    // assign active class to the current state
    $states
        .find('article')
        .removeClass('active')
        .filter('#'  + fsm.state)
        .addClass('active');

    // update buttons
    $buttons
        .each(function(i, e){
            e.disabled = ! fsm.can(e.name) || fsm.isPaused();
        });
}

function setup(fsm) {

    // assign to window
    window.fsm = fsm;

    // elements
    $states = $('#states');
    $buttons = $('#controls button');

    // bind button clicks to fsm actions
    $buttons.on('click', function (event) {
        fsm.do(event.target.name);
    });

    // update UI when fsm state changes
    fsm.on('update', update);

    // update
    update();
    console.log(fsm)
}