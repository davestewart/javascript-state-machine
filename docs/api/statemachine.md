# StateMachine

The StateMachine class is the primary interface to manage states, actions, handlers and transitions. 

You instantiate the StateMachine via the `new` operator and an `options` object to configure transitions and handlers. After instantiation you can add additional transitions and handlers via the public methods, as well as interact with transitions, and test for states and actions to update any connected UI, via event handler callbacks.

For code examples, see:

- the [usage](../main/usage.md) page for a full code example
- the [options](../config/options.md) page for more information on instantiation options.
- the [demo](http://statemachine.davestewart.io/html/api) site for examples of the full StateMachine API.

## State functions

<h4>
	<a name="do" href="#do">#</a>
	<code>do(action, ...rest)</code>
</h4>

Attempt to run an action, resulting in a transition to a state. Returns `true` if the transition is available and `false` if not.

Generally, you map calls to `do()` from buttons in your UI. See the demo site for more examples.

You can pass additional parameters to the function which are passed to any registered event handlers triggered during the tranistion.

<h4>
	<a name="go" href="#go">#</a>
	<code>go(state, force = false)</code>
</h4>

Attempt to go to a state. If the current state already transitions to the target state, StateMachine will call the action go to that state. If not, you can pass `true` as the second parameter to skip any transition and go straight to the state.


## Modification functions

<h4>
	<a name="add" href="#add">#</a>
	<code>add(action, from, to)</code>
</h4>

Add a transition to the StateMachine. 

<h4>
	<a name="remove" href="#remove">#</a>
	<code>remove(state)</code>
</h4>

Remove a state from the StateMachine. If the removal results in any orphaned actions or states, they are removed as well.


## Handler functions

Use these functions to manage event callbacks as the StateMachine transitions.

<h4>
	<a name="on" href="#on">#</a>
	<code>on(pattern, fn)</code>
</h4>

Add an event handler callback. To view available patterns, see the [handlers](../config/handlers.md) section.


<h4>
	<a name="off" href="#off">#</a>
	<code>off(pattern, fn)</code>
</h4>

Remove an event handler added with the same pattern and handler.

<h4>
	<a name="trigger" href="#trigger">#</a>
	<code>trigger(pattern, ...rest)</code>
</h4>

Trigger an event handler, optionally passing arguments.

## Transition functions

Use these functions from transition event handler callbacks to manipulate the current transition.

<h4>
	<a name="pause" href="#pause">#</a>
	<code>pause()</code>
</h4>

Pause any current transition.


<h4>
	<a name="resume" href="#resume">#</a>
	<code>resume()</code>
</h4>

Resume any paused transition.


<h4>
	<a name="cancel" href="#cancel">#</a>
	<code>cancel()</code>
</h4>

Cancel any current transition.


<h4>
	<a name="end" href="#end">#</a>
	<code>end()</code>
</h4>

End any current transition, skipping remaining handlers.




### Query functions

Use these functions to query the state of the state machine to update any connected UI.

<h4>
	<a name="canDo" href="#canDo">#</a>
	<code>canDo(action)</code>
</h4>

Query the transition map to see if an action is available from the current state.


<h4>
	<a name="canGo" href="#canGo">#</a>
	<code>canGo(to)</code>
</h4>

Query the transition map to see if a state is available to go to. 

<h4>
	<a name="has" href="#has">#</a>
	<code>has(state)</code>
</h4>

Test if a state exists.


<h4>
	<a name="is" href="#is">#</a>
	<code>is(state)</code>
</h4>

Test if the current state is the same as the supplied one.


<h4>
	<a name="isStarted" href="#isStarted">#</a>
	<code>isStarted()</code>
</h4>

Test if the StateMachine has started.


<h4>
	<a name="isTransitioning" href="#isTransitioning">#</a>
	<code>isTransitioning()</code>
</h4>

Test if the StateMachine is transitioning.


<h4>
	<a name="isPaused" href="#isPaused">#</a>
	<code>isPaused()</code>
</h4>

Test if the StateMachine is paused (whilst transitioning).


<h4>
	<a name="isComplete" href="#isComplete">#</a>
	<code>isComplete()</code>
</h4>

Test if the StateMachine is on the "final" state.



## Initialisation functions


<h4>
	<a name="start" href="#start">#</a>
	<code>start()</code>
</h4>

Starts the StateMachine if not already started.


<h4>
	<a name="reset" href="#reset">#</a>
	<code>reset(initial = '')</code>
</h4>

Reset the StateMachine to the initial, or supplied, state
