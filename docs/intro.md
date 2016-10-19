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
- Use functions for conditional / dynamic states

Configuration

- Assign multiple "to" and "from" states by wildcard `'*'` or array `['foo', 'bar', 'baz']`
- Expressive shorthand state assignment `action : from > to` or `action : to < from`
- Expressive shorthand callback assignment `'verb state': function () { ... }`


Options

- Output debug messages


## Mentions

The concepts for this state machine were inspired heavily by the [@jakesgordon](https://github.com/jakesgordon/javascript-state-machine/), however as that project has not been updated since 2013 and also suffers from some a 

Changes