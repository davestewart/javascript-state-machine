# JavaScript State Machine

![state-machine-map](https://cloud.githubusercontent.com/assets/132681/20330716/a9446ecc-ab98-11e6-89b7-8c55a5abb46e.gif)

### Abstract

State Machine is a library for managing a finite set of states, and moving between them via actions and transitions.

From its intuitive configuration through its powerful event-based architecture and rich API, State Machine makes it easy to describe and manage interaction with complex state-dependent systems like components, multi-step forms, purchase funnels, visualisations or games.

### Features

State Machine has been designed from the outset to feel intuitive and fun to use:

- Easily-configurable via JSON config or instance methods
- DSL for shorthand transition and handler assignment
- Add and remove states and actions on the fly
- Pause, resume, cancel or end transitions at any point
- Handle system, state, action and transition events
- Rich API and system introspection
- Object-oriented architecture; fully-inspectable in DevTools


### Demo

View the live demo at:

- [statemachine.davestewart.io](http://statemachine.davestewart.io)

To run demo locally, see the build tasks at the bottom of this readme.
 
### Docs

View the documentation at:

- [github.com/davestewart/javascript-state-machine/tree/master/docs](https://github.com/davestewart/javascript-state-machine/tree/master/docs)

The docs will also be downloaded with the repository. 

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