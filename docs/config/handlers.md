# Handlers

## Overview

Handlers are StateMachine's mechanism to hook into lifecycle events and run custom code. They work just the same as event handlers in the browser, with `Event` objects being dispatched and passed to the event handler function, where you can take action, run code, etc.

There are a variety of event types / Event classes that describe the lifecycle a StateMachine system, all of which are described in the [Events](../api/events.md) section of the documentation.

This section describes how hook into events by way of "shorthand" handler syntax.

## Handler syntax

StateMachine keeps a map of event / callback pairs internally, which it uses to fire the correct events and call the correct handlers as the system transitions from state to state.

Because this map is somewhat complicated, and one of the aims of the project was to make using a finite state machine easy, a DSL (domain specific language) to reference lifecycle events has been developed.

Briefly, any lifecycle hook can be referenced using a few key words with some additional grammar, making it easy to specify handlers where it might otherwise might have been difficult, for example `state.intro.next.start`.

As an example, here are some typical use cases (note that patterns are always strings):

```
'change'
'pause'
'state.add'
'intro'
'intro:leave'
'intro@next'
'@next'
'(intro form)@next'
```

By combining keywords and grammar together in various different ways, you can quickly specify the exact object and/or lifecycle target to hook into.

You can experiment with an interactive handler demo here:

- [statemachine.davestewart.io/html/api/events/playground.html](http://statemachine.davestewart.io/html/api/events/playground.html)

The specific syntax for keywords and grammars is summarised below:

<table class="table table-bordered table-striped indent">
    <thead>
        <tr><th>Format</th><th>Description</th></tr>
    </thead>
    <tbody>
        <tr><td><code>alias</code></td><td>Any single word that resolves to a namespaced type, state or action</td></tr>
        <tr><td><code>namespace.type</code></td><td>Absolute syntax for namespaced types</td></tr>
        <tr><td><code>@action</code></td><td>An action name</td></tr>
        <tr><td><code>#state</code></td><td>Alternative state name identifier to using an <code>alias</code></td></tr>
        <tr><td><code>:type</code></td><td>An event type, for action or state events</td></tr>
        <tr><td><code>(foo bar baz)</code></td><td>Grouping for multiple patterns, which are expanded to multiple handlers</td></tr>
    </tbody>
</table>

## Handler assignment

You can assign handlers via the constructor `options` like so:

```javascript
var options = {
    handlers: {
        'change' : function (event, fsm) { ... },
        'intro@next' : function (event, fsm, foo, bar) { ... },
    }
};
var fsm = new StateMachine(options);
```

Alternatively, you can assign them via `fsm.on()`:

```javascript
var fsm = new StateMachine();
fsm.on('change', function (event, fsm) { ... });
```

The method is chainable, so you can add multiple handlers this way, though bear in mind that you can also use the grouping syntax `(a b c)` to assign the same handler to multiple events.


## Handler execution

Any event handler callback should be of a specific format:

```javascript
function (event, fsm, ...rest) { ... }
```

All handlers are passed first the specific `Event` instance describes the lifecycle hook, then a reference to the owning `StateMachine` then any optional parameters that may have been passed for some cases.

Inside the event handler you are free to call whatever code you like, using `this` to refer to the configured scope.

If you need to pause, resume or cancel a transition, you can do it via the `fsm` parameter, like so:

```javascript
function onChange(event, fsm) 
{
    fsm.pause();
    asynchronousCall(function onComplete() {
        fsm.resume();
    });
}
```

 

## Handler id patterns

This section outlines in detail, the specific handler id patterns that you can use to hook into lifecycle events.

You can experiment yourself with writing handler ids and seeing how they parse here:

- [statemachine.davestewart.io/html/api/events/interactive.html](http://statemachine.davestewart.io/html/api/events/interactive.html)

Note that the StateMachine's lifecycle means that some hooks effectively overlap each other; for example `action:start` and `state:leave` are effectively the same thing, but your particular implementation may require, or benefit from, the subtle semantic / ordering differences between them.

### Everyday patterns

You'll use these patterns pretty much every time you use StateMachine, as they map to events common / logical to the majority of use cases.

<h4>
	<a name="alias" href="#alias">#</a>
	A namespaced event alias or single state: <code>alias</code>
</h4>

This is a convenience / catch-all pattern that maps a single word to one of two options:

- a namespaced event, for example `change` or `pause`
- a single state, for example `intro`

Examples:

```
change      // system.change
pause       // transition.pause
intro       // a state in your system called "intro"
```
Note that namespaced event aliases take precendence over named states, so be careful not to name your states where they can never have handlers attached due to conflicts.


<h4>
	<a name="namespaced" href="#namespaced">#</a>
	A namespaced event: <code>namespace.event</code>
</h4>

An namespaced reference to an event, such as `system.change` or `state.add`.

Examples:

```
state.add           // catches any states added
action.remove       // catches any actions removed
transition.pause    // absolute path to the alias `pause`
```

<h4>
	<a name="oneState" href="#oneState">#</a>
	A single state: <code>state</code>
</h4>

A single named state in (or not yet in) your system.

Note that because of default options, single state patterns default to `state:enter` meaning that any handlers assigned using this pattern will fire as the state is entered.

Examples:

```
intro
form
summary
```



<h4>
	<a name="oneStateAction" href="#oneStateAction">#</a>
	A single state's action: <code>state@action</code>
</h4>

An action called from a specific state.

This pattern gives you allows you to specifically target a state and action, giving you fine-grained control over when to fire a handler.
 
Appropriate use cases might be submitting a form or recovering from an error state.

Examples:

```
form@submit
error@back
```



<h4>
	<a name="oneAction" href="#oneAction">#</a>
	A single action: <code>@action</code>
</h4>

A single named action in (or not yet in) your system.

Note that because of default options, single action patterns default to `action:start`, meaning that any handlers assigned using this pattern will fire as the action starts.

Also note that as an action can be used across multiple states, that you can use this to target multiple states.

Examples:

```
@next
@restart
@quit
```



### Occasional patterns

You'll probably only need these patterns rarely, but the grammar allows them, so here they are.


<h4>
	<a name="oneStateEvent" href="#oneStateEvent">#</a>
	A single state's type: <code>state:type</code>
</h4>

This pattern allows you to hook into a single state's `:enter` or `:leave` event.

The `:enter` type is the state event type configured by-default, so you may find this useful when you need to target an action's `leave` event.

Examples:

```
intro:leave
```


<h4>
	<a name="oneActionEvent" href="#oneActionEvent">#</a>
	A single action's type: <code>@action:type</code>
</h4>

This pattern allows you to hook into an action's `:start` or `:end` event.

The `:start` type is the action event type configured by-default, so you may find this useful when you need to target an action's `end` event.

Examples:

```
@submit:end
```


<h4>
	<a name="type" href="#type">#</a>
	Any state or action's type: <code>:type</code>
</h4>

This catch-all pattern allows you hook into any state or action's events, so in the case of states, `:enter` or `leave` or the case of actions `:start` or `:end`.

Note that in an already-rich event model, there are no events for transition start and end, so as actions begin and end transitions, you can use action events to simulate this:

```
:start      // transition.start
:end        // transition.end
```

Examples:

```
:start      // start any action
:leave      // leave any state
```
