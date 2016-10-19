
## Architecture

The state machine comprises 3 main classes:

- `StateMachine` - the instantiated class and main entry point to managing state
- `Transition` - class that manages the lifecycle between states, calling event handlers, etc
- `StateEvent/ActionEvent` - events dispatched to handlers with information about the transition

### Vocabulary

The vocabulary of the state machine is represented by the following concepts:

- `state` - a current or future state of the system that you wish to move "from" or "to"
- `action` - named tasks which map to intended state changes, i.e. "next" or "submit"
- `transition` - the mechanism by which the FSM is updated from one state to another
- `handler` - callback functions registered to lifecycle hooks that receive events
- `event` - an ActionEvent or StateEvent event that is dispatched as a transition moves through its lifecycle
- `name` - the name of the action or state event, i.e. "next" or "intro"
- `verb` - the method of the action or state event, i.e. "start" or "enter"


### Configuration

The State Machine is configured via a configuration object, the main components being:

- `events` - the action "name", "from" and "to" states for each step
- `actions` - event handlers to run for named "action/state" "verbs"
- `options` - additional configuration data, such as initial state or debug output
