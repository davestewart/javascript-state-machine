# JavaScript State Machine

## Overview

As the name suggests, this project is a JavaScript implementation of a state machine, however, with the express aims to be:

- Easily configurable
- Highly flexible
- Fluent and expressive
- Fully object-oriented
- Event-driven

It was designed with front-end web application use in mind, namely things like multi-step wizards, installation processes, sign-up processes, shopping carts, product funnels, even simple games.



## Feature highlights

Expressive, shorthand transition assignment notation:

```
next    : a > b > c > d
back    : a < b < c < d
restart : a < b   c   d
exit    : a   b   c   d > x
```

Powerful yet relevant API:

- Manage the system: `do()`, `go()`
- Check actions: `can()`, `cannot()`
- Check states: `is()`, `has()`, `getStatesFor()`
- Check actions: `getActionsFor()`, `getActionForState()`
- Check transitions: `isStarted()`, `isTransitioning()`, `isPaused()`, `isComplete()`
- Manipulate transitions: `pause()`, `resume()`, `cancel()`, `end()`, `reset()`
- Modify states: `add()`, `remove()`
- Manage events: `on()`, `off()`

Highly-flexible, event-driven architecture:

- Extremely granular interaction with system lifecycle events
- Hook into `System`, `Transition`, `Action` and `State` events
- Logical transition callback queue allows layering of multiple handlers
- Pause, resume, cancel or end transitions at any point

Object-oriented

- Stick a breakpoint in anywhere, and see real JavaScript classes with real properties in the Inspector
- Debug any system method, transition lifecycle event, or event handler callback quickly and easily
- Poke around in the innards of the StateMachine or Transition classes and really understand what is happening


Powerful, shorthand event handler assignment notation grammar:

```javascript
fsm
    .on('change', onChange)
    .on('transition.pause', onPause)
    .on('intro:leave', onIntroLeave)
    .on('form@submit', onSubmit);
    .on('(cancel|reset|quit).end', onExit)
```


Rich set of demos to play with:

- 18 API feature demos
- 7 real-world example demos

For more information see the [docs](docs/readme.md) section.


## Getting started

The easiest thing to see all the features in action is to play with the live demos.

See the `demo/` folder for various examples of state machine usage, and run it using the instructions below.
 

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