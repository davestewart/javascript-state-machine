# Events

## Overview

StateMachine, like many other systems, uses events to communicate changes in a decoupled manner.

There are four different event types to respond to, which correlate to the main parts of the system that is undergoing change:

- [SystemEvents](#systemevent) - such as starting, when the configuration is changed, or reaching the final state
- [TransitionEvents](#transitionevent) - when a transition is paused, resumed or cancelled
- [StateEvents](#stateevent) - when a state event handler is triggered
- [ActionEvents](#actionevent) - when an action event handler is triggered

To hook into an event, you need to add an event handler with an event handler shorthand, and a callback to run JavaScript code:

```
var fsm = new StateMachine(options);
fsm.on('form@next', function (event, fsm) {
    console.log('About to submit the form...');
});
```

All events pass two arguments by default: the actual `Event` object and a reference to the owning `StateMachine`.

The event handler shorthand (to hook into different events) is discussed at length [here](../config/handlers.md).

## SystemEvent

SystemEvents are called in response to system level event handlers.

<h4>
	<a name="system.start" href="#system.start">#</a>
	<code>start</code>
</h4>

Fired when the StateMachine starts. 

Useful to lazily wire up any UI, especially for delayed starts (where the FSM option `start` is set to `false`).

<h4>
	<a name="system.change" href="#system.change">#</a>
	<code>change</code>
</h4>

When a transition has completed and there is a change of state. Check the event `source` to see what the state is, or even the `fsm.state`:

```javascript
function onCHange (event, fsm) {
    event.source === fsm.state;
}
```


<h4>
	<a name="system.complete" href="#system.complete">#</a>
	<code>complete</code>
</h4>

Fired when the state reaches the `final` state. 

The final state is either implicitly declared as the *last* state parsed while adding transitions, or explicitly declared in [options](../config/options.md#final) as `final`.


<h4>
	<a name="system.reset" href="#system.reset">#</a>
	<code>reset</code>
</h4>

When `fsm.reset()` method is called, and the StateMachine has reset to the initial state.



## TransitionEvent

<h4>
	<a name="system.pause" href="#system.pause">#</a>
	<code>pause</code>
</h4>

Fired when the StateMachine has been paused or unpaused via `fsm.pause()` or `fsm.resume()`.

Hook into this state to update the UI, such as locking it, or displaying a loading icon. Check for paused state via the event's `value` property:

```javascript
function onPause (event, fsm) {
    $loadingIcon.toggleClass('block', event.value);
}
```

<h4>
	<a name="system.cancel" href="#system.cancel">#</a>
	<code>cancel</code>
</h4>

Fired when a transition has been cancelled.

Because a cancelled transition doesn't change teh StateMachine's state, listen for this event to update any already-updating UI, for example to stop any animation, or hide loading icons.



## StateEvent

StateEvents are called when state event handlers are triggered.

They give the opportunity to run JavaScript code, as well as modify the transition, such as pausing it or cancelling it.



## ActionEvent

ActionEvents are the same as StateEvents, but for actions.




