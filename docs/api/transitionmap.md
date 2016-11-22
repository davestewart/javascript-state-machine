# TransitionMap

TranistioMap is the main logic class behind StateMachine's functionality. It stores available states and actions, and the relationships between them in a `ValueMap`.

StateMachine uses it for its main functions, so you shouldn't need to ue it directly, but there may be times, if you have some custom logic, that you might want to directly query states and actions in more detail.


## Transition modification

<h4>
	<a name="add" href="#add">#</a>
	<code>add(action, from, to)</code>
</h4>

Add a new transition.


<h4>
	<a name="remove" href="#remove">#</a>
	<code>remove(state)</code>
</h4>

Remove an existing state. If the removal causes any orphaned states or actions, these are removed as well.

## Querying states and actions

<h4>
	<a name="getActionsFrom" href="#getActionsFrom">#</a>
	<code>getActionsFrom(from, asMap = false)</code>
</h4>

Gets an `array` of available action `string`s *from* a state.

This function returns a list of `string` actions, unless `asMap` is passes, then an `object` of `action:state` pairs is returned.


<h4>
	<a name="getActionFor" href="#getActionFor">#</a>
	<code>getActionFor(from, to)</code>
</h4>

Gets a single `string` action (if available) for another state. You would normally use this function if you have two known states and you want to see if they are connected.


<h4>
	<a name="getStatesFrom" href="#getStatesFrom">#</a>
	<code>getStatesFrom(from)</code>
</h4>

Gets an `array` of available `string` states from a single state.


<h4>
	<a name="getStateFor" href="#getStateFor">#</a>
	<code>getStateFor(from, action)</code>
</h4>

Gets a single `string` state (if available) for another state and action. You would normally use this function if you have a known state and action and you want to see if there is a transition for that action.


<h4>
	<a name="getStates" href="#getStates">#</a>
	<code>getStates()</code>
</h4>

Gets an `array` of all states in the StateMachine.

<h4>
	<a name="getActions" href="#getActions">#</a>
	<code>getActions()</code>
</h4>

Gets an `array` of all actions in the StateMachine.


<h4>
	<a name="get" href="#get">#</a>
	<code>get(...path)</code>
</h4>

Directly queries the `ValueMap` instance for a state or action.
 
The `path` argument is a dot-syntax path, created usually by a result from `on()` or `off()` that returns a nested property which StateMachine uses to store relationships, such as:

```
actions.*.next
```

<h4>
	<a name="hasState" href="#hasState">#</a>
	<code>hasState(state)</code>
</h4>

Tests whether a single `string` state exists in the StateMachine.


<h4>
	<a name="hasAction" href="#hasAction">#</a>
	<code>hasAction(action)</code>
</h4>

Tests whether a single `string` action has a transition to another state. Used by StateMachine's exists in the StateMachine.


<h4>
	<a name="hasTransition" href="#hasTransition">#</a>
	<code>hasTransition(action, from, to)</code>
</h4>

Tests whether the transition from a single `string` state to another `string` state via a `string` action exists.


<h4>
	<a name="has" href="#has">#</a>
	<code>has(...path)</code>
</h4>

Direct access to the `ValueMap`'s `has()` method. Mainly used internally.

