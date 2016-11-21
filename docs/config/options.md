# Options


StateMachine is configured mainly via a hash of options passed to its constructor function:

```javascript
var fsm = new StateMachine(options);
```

The following options are available:

## Behaviour

<h4>
	<a name="transitions" href="#transitions">#</a>
	<code>{array} transitions:</code>
</h4>

An array of transition assignments. 

The array should contain either `object` or `string` configurations, for example:

```javascript
[
    // object
    {action:'next', from:'intro', to:'form'},
    
    // string
    'next : intro > form'
]
```

See the [Transitions](transitions.md) section for more detailed information.

<h4>
	<a name="handlers" href="#handlers">#</a>
	<code>{object} handlers:</code>
</h4>

A hash of event handlers.

The hash should contain a hash of `id:callback` pairs, for example:

```javascript
{
    next: function (event, fsm) { ... },
    'state.add' : function (event, fsm, foo, bar) { ... }
}
```

Note that all handlers receive `event` and `fsm` (the current StateMachine instance) arguments, then any optional arguments that were sent via `fsm.do()`.

See the [Handlers](handlers.md) section for information on handler shorthand.

<h4>
	<a name="scope" href="#scope">#</a>
	<code>{object} scope:</code>
</h4>

A scope to run event handlers in.

Defaults to the owning StateMachine instance.

<h4>
	<a name="start" href="#start">#</a>
	<code>{boolean} start:</code>
</h4> 

A boolean to start the state machine as soon as it has been instantiated.

Defaults to `true`. Set to `false` to delay startup, then call `fsm.start()` later.

## States

<h4>
	<a name="initial" href="#initial">#</a>
	<code>{string} initial:</code>
</h4>

An initial state to start the state machine in.

Defaults to the first configured state (if there is one).

If an initial state is not passed it, the StateMachine defaults to the first configured state.

<h4>
	<a name="final" href="#final">#</a>
	<code>{string} final:</code>
</h4>

An state which can be considered the end state.

When transitioned to, StateMachine dispatches a `system.complete` event, allowing you to call additional functionality.

## Error handling

<h4>
	<a name="invalid" href="#invalid">#</a>
	<code>{boolean} invalid:</code>
</h4>

An flag to accept handlers for potentially invalid states or actions in either the handler config, or assigning handlers via `.on()`.


The purpose of this is to warn against setting handlers that will never be called, and works in conjunction with the `errors` option.

Defaults to `false`; disallowing non-existent states. Set this to `true` if you intend to add states at run time.

<h4>
	<a name="errors" href="#errors">#</a>
	<code>{number} errors:</code>
</h4>

An error level which affects how invalid states are reported. 

Can be one of:

- `0` - quiet; don't report
- `1` - warn; run a `console.warn()` regarding the state or action
- `2` - error; throw a catchable error regarding the state or action

Defaults to `1`.

## Defaults

<h4>
	<a name="order" href="#order">#</a>
	<code>{array} order:</code>
</h4>

The order that callback types should be run in, during a transition. 

The default order is:

```
action.*.start
action.{action}.start
state.*.{action}
state.{from}.{action}
state.{from}.leave
state.*.leave
state.*.enter
state.{to}.enter
action.{action}.end
action.*.end
```

These would generally not need to be overridden, but could be depending on your use case.

To get these defaults as an array, call `StateMachine.getDefaultOrder()`.

<h4>
	<a name="defaults" href="#defaults">#</a>
	<code>{object} defaults:</code>
</h4>

Some sensible defaults uses by StateMachine.

The default values are:

```
action  :'start',
state   :'enter'
```

These generally don't need to be overridden, but can be if required; for example you want to change the default event types for shorthand handler assignment.