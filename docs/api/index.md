# API

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


#### `Transition`

The class responsible for all lifecycle events between states; a single transition is instantiated for each action. It's main tasks are:

- Preparing the callbacks, events and parameters for each transition
- Queuing only registered event handlers
- Calling the event handlers in order, and passing the correct parameters
- Responding to the returned results


## Events

There are 4 event classes:

- `SystemEvent` - dispatched for any action lifecycle events, i.e. `start`, `change`, `update`
- `TransitionEvent` - dispatched for any action lifecycle events, i.e. `pause`, `resume` and `cancel`
- `ActionEvent` - dispatched for any action lifecycle events, i.e. `start` and `end`
- `StateEvent` - dispatched for any state lifecycle events, i.e. `leave` and `enter`


## Visual

The following [ASCII](https://github.com/davestewart/javascript-ascii) output gives you an idea of how the classes work together:

```
 +- StateMachine
     +- state: "none"
     +- config: Config
     |   +- initial: "none"
     |   +- final: "c"
     |   +- debug: true
     |   +- scope: StateMachine <recursion>
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
     +- transitions: TransitionMap
     |   +- map: ValueMap
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
     +- handlers: ValueMap
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
