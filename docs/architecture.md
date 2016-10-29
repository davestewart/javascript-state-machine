# Architecture

One of the aims of the project was to be fully object-oriented, and as logical as possible without getting too hung up on the theory side of things.


##### Caveat 

Whilst the code is tight, this implementation is optimised for ease of use rather than performance, so if using it for 1000s of game characters perhaps, you might be better rolling your own!

## Main classes

The state machine comprises 3 main class:

#### `StateMachine`
 
The main instantiated class and entry point to managing state; its main responsibilities are:

- Instantiating the system
- Looking after the overall configuration
- Converting shorthand notation to configuration
- Adding and removing transitions (actions and states)
- Adding and removing event handlers
- Executing actions and dispatching events
- Pausing, resuming, cancelling and ending transitions


#### `TransitionMap`

The brain of the state machine; its responsibilities are:

- Building and storing the relationships between states
- Determining what states are allowed to link
- Determining what actions are allowed to run
- Maintaining a high-performance cache of action and event names

The TransitionMap can also be instantiated by itself, should you require a lightweight base to the full StateMachine, perhaps to build your own with:

```
var tm = new TransitionMap();
tm.add('next', 'a', 'b');
tm.add('back', 'b', 'a');
```


#### `Transition`

The class responsible for all lifecycle events between states; a single transition is instantiated for each action. It's main tasks are:

- Preparing the callbacks, events and parameters for each transition
- Queuing only registered event handlers
- Calling the event handlers in order, and passing the correct parameters
- Responding to the returned results


## Additional classes

There are 4 event classes:

- `SystemEvent` - dispatched for any action lifecycle events, i.e. `start`, `change`, `update`
- `TransitionEvent` - dispatched for any action lifecycle events, i.e. `pause`, `resume` and `cancel`
- `ActionEvent` - dispatched for any action lifecycle events, i.e. `start` and `end`
- `StateEvent` - dispatched for any state lifecycle events, i.e. `leave` and `enter`

There are 2 helper classes:

- `Config` - a class to process instantiation options and manage default values
- `ValueMap` - a utility to conveniently manage nested properties such as transitions, handlers, etc.


## Configuration

The State Machine is configured via a configuration object, the main components being:

- `transitions` - the "action", "from" and "to" states for each step
- `handlers` - event handlers to run on lifecycle events
- `options` - additional configuration data, such as initial state or debug output


## Vocabulary

The vocabulary of the state machine is represented by the following entities:

- `system` - the collective name for the states and actions the FSM is managing
- `state` - a current or future state of the system that you wish to move "from" or "to"
- `action` - a named trigger which may cause a change of system state, i.e. "next" or "submit"
- `transition` - the mechanism by which the FSM moves from one state to another
- `handler` - any callback functions registered to lifecycle hooks
- `event` - objects that are passed to callbacks with information about the thing which has taken place
- `source` - the source entity of the action or state event, i.e. "next" or "intro"
- `type` - the type of action or state event, i.e. "start" or "enter"


## Visual

The following ASCII output give you an idea of how the classes work together:

```
 +- [object StateMachine]
     +- state: "none"
     +- config: [object Config]
     |   +- initial: "none"
     |   +- final: "c"
     |   +- debug: true
     |   +- scope: [object StateMachine] <recursion>
     |   +- transitions: Array[3]
     |   |   +- 0: "start : none > a"
     |   |   +- 1: "next : a > b > c > a"
     |   |   +- 2: "back : a < b < c < a"
     |   +- order: Array[10]
     |   |   +- 0: "action.*.start"
     |   |   +- 1: "action.{action}.start"
     |   |   +- 2: "state.*.{action}"
     |   |   +- 3: "state.{from}.{action}"
     |   |   +- 4: "state.{from}.leave"
     |   |   +- 5: "state.*.leave"
     |   |   +- 6: "state.*.enter"
     |   |   +- 7: "state.{to}.enter"
     |   |   +- 8: "action.{action}.end"
     |   |   +- 9: "action.*.end"
     |   +- defaults: Object
     |       +- initialize: "initialize"
     |       +- action: "start"
     |       +- state: "enter"
     +- transitions: [object Transitions]
     |   +- map: [object ValueMap]
     |   |   +- data: Object
     |   |       +- none: Object
     |   |       |   +- start: "a"
     |   |       +- a: Object
     |   |       |   +- next: "b"
     |   |       |   +- back: "c"
     |   |       +- b: Object
     |   |       |   +- next: "c"
     |   |       |   +- back: "a"
     |   |       +- c: Object
     |   |           +- next: "a"
     |   |           +- back: "b"
     |   +- states: Array[4]
     |   |   +- 0: "none"
     |   |   +- 1: "a"
     |   |   +- 2: "b"
     |   |   +- 3: "c"
     |   +- actions: Array[3]
     |       +- 0: "start"
     |       +- 1: "next"
     |       +- 2: "back"
     +- handlers: [object ValueMap]
         +- data: Object
             +- system: Object
             |   +- update: Array[1]
             |   |   +- 0: function update()
             |   +- start: Array[1]
             |   |   +- 0: function onSystem(event)
             |   +- change: Array[1]
             |       +- 0: function onSystem(event)
             +- transition: Object
             |   +- pause: Array[1]
             |       +- 0: function onTransition(event)
             +- action: Object
             |   +- *: Object
             |       +- start: Array[1]
             |           +- 0: function onAction(event)
             +- state: Object
                 +- *: Object
                 |   +- enter: Array[1]
                 |       +- 0: function onState(event)
                 +- a: Object
                     +- next: Array[1]
                         +- 0: function onState(event)
```