# JavaScript State Machine

## Abstract

### Overview

If you've not heard of or used a (finite) state machine (FSM) before, it might sound like an overly-dry programming concept that has little relevance to everyday web development. 

However, a number of common processes such as multi-step wizards, installation processes, sign-ups, shopping carts, product funnels, even game states benefit hugely from the structure a FSM provides.

With some initial thought about the steps and actions of your system, it becomes fairly easy to convert that into a simple JSON configuration, which the FSM can use to manage your application's state, and allowable interactions.

### Benefits

By planning states (views), actions (buttons) and handlers (callbacks) in advance, you can:
 
- reason more easily about the overall flow of the system
- clearly see where to handle things like user input, validation, or server calls
- radically clean up your code by handling business logic in action or state-driven callbacks
- delegate normally spaghetti-like navigation logic to the FSM
- trivially derive secondary state for items such as navigation and buttons from the FSM state

The end result is a system where your components are fully decoupled and contain much less code; their job essentially becomes to display data, whilst the properties that drive navigation (the "state") is managed by, and within, the FSM.

The first time you set up a state machine, it can feel difficult to mentally-map what you normally do fluidly or intuitively in code, to what feels initially like a rigid structure of states and actions, but it doesn't take too long to begin thinking in this new way, and your project's architecture will thank you.

### Features

- Fully OO with event-driven architecture
- Rich API and logical introspection
- Add and remove states and actions on the fly
- Easily-configurable via JSON or instance methods
- Optional shorthand configuration DSL
- Pause, resume, cancel or end events at any point
- Incredibly flexible family of events to hook into
- Debugging mode with warning and informational console output


### Demo

See the `demo/` folder for various examples of state machine usage.
 

## Development

### Installation

Until available on NPM, pull from the main github repoistory:

- https://github.com/davestewart/javascript-state-machine/


### Tasks

The following NPM tasks are available, via `npm run <task>`:

- `dev` - compile and watch the source to `state-machine.js`
- `build` - compile teh source to `state-machine.min.js`
- `demo` - compile, watch and copy the development build to `demo/` and serve demo files at `http://localhost:8888`
- `test` - run all tests


## Mentions

Key concepts inspired by [@jakesgordon](https://github.com/jakesgordon/javascript-state-machine/)'s JavaScript State Machine.