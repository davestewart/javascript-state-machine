# Architecture

## Classes

The state machine comprises 2 main classes:

- `StateMachine` - the instantiated class and main entry point to managing state
- `Transition` - class that manages the lifecycle between states, calling event handlers, etc

There are 4 event classes:

- `SystemEvent` - dispatched for any action lifecycle events, i.e. `start`, `change`, `update`
- `TransitionEvent` - dispatched for any action lifecycle events, i.e. `pause`, `resume` and `cancel`
- `ActionEvent` - dispatched for any action lifecycle events, i.e. `start` and `end`
- `StateEvent` - dispatched for any state lifecycle events, i.e. `leave` and `enter`


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


## Configuration

The State Machine is configured via a configuration object, the main components being:

- `transitions` - the "action", "from" and "to" states for each step
- `handlers` - event handlers to run on lifecycle events
- `options` - additional configuration data, such as initial state or debug output
