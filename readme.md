# JavaScript State Machine

## Abstract

If you've not heard of or used a (finite) state machine (FSM) before, it might sound like an overly-dry programming concept that has little relevance to everyday web development. 

However, a number of common processes such as multi-step wizards, installation processes, sign-ups, shopping carts, product funnels, even game states benefit hugely from the structure a FSM provides.
 
By planning states (views), actions (buttons) and handlers (callbacks) in advance, you can:
 
- reason more easily about your process' logic
- delegate the underlying route-finding logic to the FSM
- radically clean up your code by assigning business logic to action or state-driven callbacks
- trivially derive secondary state for items such as navigation and buttons from the FSM state

Additionally, by moving much of the data and logic for a process outside of the child steps, your components can become much simpler and more decoupled; their job essentially becomes to display data, whilst business logic for the process.

## Overview

Using JavaScript State Machine in your code is easy. 

You create a new StateMachine instance, then assign the states and actions required to move from state to state, along with optional callbacks to run as things change.

A simple example such as a 3 step sign-up form might be as simpled as:

```javascript
var fsm = new StateMachine(target, 
{
    events: 
    [
        // shorthand "action/state" event notation
        'next   : intro > settings',
        'next   : settings > summary',
        'finish : summary > complete',
        'error  : summary > sorry'
    ],
    
    handlers: 
    {
        // validate form
        'leave settings': function (event) 
        {
            // cancel if the form didn't validate
            if( ! this.validate() ) 
            {
                return false; // alternative to event.pause()
            }
        },
                    
        // submit data
        'leave summary': function (event) 
        {
            // pause transition to complete async action
            event.pause();
            this
                .submit()
                .then(event.resume)
                .fail(function(){
                    // cancel and go directly to error state
                    event.reset('error');
                });
        },
        
        // we're done!
        'end finish': function(event) 
        {
            // run internal process to complete
            this.trigger('complete');
        }
    }
});
```

Events are made up of "actions" and "states", with actions being easily mapped to buttons. 

As you can see here there are two "next" actions but referring to different "from" and "to" states. StateMachine determines the correct "to" state for same-named actions by mapping it from the current named state.


Both action and state verbs (start, end, leave, enter) can have handlers attached, allowing you to:

- run application code
- pause state transitions (for example, to call asynchronous code)
- resume or cancel transitions (depending on the response)

You can attach multiple handlers, not just to pause and cancel actions for example, but to update the UI navigation or reset forms.

StateMachine's public API and event system provides hooks into available actions and states from each state, so it becomes trivial to enable or disable buttons, or update navigation or components as you move from state to state.

The following is a Vue.js example:

```
<component :is="fsm.state"></component>
<nav>
    <button :disabled="{{ ! fsm.can('next') }}"   @click="fsm.do('next')">Next</button>
    <button :disabled="{{ ! fsm.can('finish') }}" @click="fsm.do('finish')">Finish</button>
</nav>
```

In summary:

- Navigation and UI logic is now expressed by way of configuration
- Decision-making logic is offloaded to the StateMachine
- Business and application logic is contained in event handlers


## Architecture

The state machine comprises 3 main classes:

- `StateMachine` - the instantiated class and main entry point to managing state
- `Transition` - class that manages the lifecycle between states, calling event handlers, etc
- `StateEvent/ActionEvent` - events dispatched to handlers with information about the transition

The vocabulary of the state machine is represented by the following concepts:

- `state` - a current or future state of the system that you wish to move "from" or "to"
- `action` - named tasks which map to intended state changes, i.e. "next" or "submit"
- `transition` - the mechanism by which the FSM is updated from one state to another
- `handler` - callback functions registered to lifecycle hooks that receive events
- `event` - an ActionEvent or StateEvent event that is dispatched as a transition moves through its lifecycle
- `name` - the name of the action or state event, i.e. "next" or "intro"
- `verb` - the method of the action or state event, i.e. "start" or "enter"

The State Machine is configured via a configuration object, the main components being:

- `events` - the action "name", "from" and "to" states for each step
- `actions` - event handlers to run for named "action/state" "verbs"
- `options` - additional configuration data, such as initial state or debug output

### Features

State 

- Add or remove states at any point
- Add or remove multiple handlers for any event (action / state change)
- Pause, resume, cancel or complete State transitions at any point

API

- Query available states and actions for each state
- Get master list of all states and actions
- Get path of actions from state to state

Events and callbacks

- Specific lifecycle hooks for Actions (`start`, `end`) and States (`leave`, `enter`)
- Individual `event.start` and global `*.start` handler assignment
- Bypass callbacks and actions if required using `reset('action')`

Configuration

- Assign multiple "to" and "from" states by wildcard `'*'` or array `['foo', 'bar', 'baz']`
- Expressive shorthand state assignment `action : from > to` or `action : to < from`
- Expressive shorthand callback assignment `'verb state': function () { ... }`


Options

- Output debug messages

### Examples

Systems

- Circular cycle
- Multi-step installation
- Wandering behaviour

Features

- Callbacks
- Dynamic callbacks


## Mentions

The concepts for this state machine were inspired heavily by the [@jakesgordon](https://github.com/jakesgordon/javascript-state-machine/), however as that project has not been updated since 2013 and also suffers from some a 

Changes