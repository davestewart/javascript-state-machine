# JavaScript State Machine

![state-machine-map](https://cloud.githubusercontent.com/assets/132681/20330716/a9446ecc-ab98-11e6-89b7-8c55a5abb46e.gif)

## Abstract

### Overview

If you've not heard of or used a (finite) state machine (FSM) before, it might sound like an overly-dry programming concept that has little relevance to everyday web development. 

However, a number of common processes such as multi-step wizards, installation processes, sign-ups, shopping carts, product funnels, even game states benefit hugely from the structure a FSM provides.


### Benefits

The first thing you'll notice when managing a system with State Machine is *vastly-less* code in your both application and your components. The minute you offload the decision-making logic to State Machine is the minute you can delete swathes of navigation code, button handlers and stateful CSS, and replace it with a few lines of StateEvent handler code. 

The second thing you'll notice is significantly less brain-ache and bugs due to trying to work out when (and often how) to show screens. State Machine has you determine states, actions and transitions as part of its configuration, and once this is done, it becomes super-easy to reason about the logic of your app or component.

In fact the configuration is so easy, you can *literally* write it out: 

```
transitions: [
    'next    : intro > form > finish',
    'back    : intro < form           < error',
    'error   :         form >           error',
    'restart : intro        < finish'
],
```

The above code is the transition configuration block from one of the demos for a multi-part form.

Listening to the correct events is also made easy with an event-specific DSL:

```
handlers: {
    'form': function reset () { ... },
    'form@next': function validate (event, fsm) { ... },
    'finish': function exit () { ... }
}
```
 
See the demo for more details.

### Thinking in states

The big difference writing a ton of vanilla JavaScript to manage your app's state and using State Machine is that you need to think in terms of "states" and "actions" right from the off – but rather than being a hindrance, it's actually a major benefit.

By planning states (views), actions (buttons) and handlers (callbacks) in advance, you can:
 
- reason more easily about the overall flow of the system
- clearly see where to handle things like user input, validation, or server calls
- delegate normally spaghetti-like navigation logic to the FSM
- radically clean up your code by handling business logic in action or state-driven callbacks
- trivially derive secondary state for items such as navigation and buttons from the FSM state

The end result is a system where your components are fully decoupled and contain much less code; their job essentially becomes to display data, whilst the logic for navigation and business is managed by, and within, the FSM.


### Features

State Machine has been designed from the outset to feel intuitive and fun to use:

- Easily-configurable via JSON config or instance methods
- DSL for shorthand transition assignment
- Add and remove states and actions on the fly
- Pause, resume, cancel or end events at any point
- Handle system, state, action and transition events
- Rich API and system introspection
- Object-oriented architecture; fully-inspectable in DevTools


### Demo

View the live demo at:

- [http://statemachine.davestewart.io](http://statemachine.davestewart.io)

To run demo locally, see the build tasks at the bottom of this readme.
 

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


**Note that**  interim builds may not always be committed on the `develop` branch, so if tinkering with the latest / running the demo, you may need to run the `dev` task first.

### Testing

To run a single or set of tests, use the following syntax:

- `npm run test -- --grep="<filename>"`


## Mentions

Inspired by [@jakesgordon](https://github.com/jakesgordon/javascript-state-machine/)'s JavaScript State Machine.