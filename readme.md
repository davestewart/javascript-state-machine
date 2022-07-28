# JavaScript State Machine

![state-machine-map](https://cloud.githubusercontent.com/assets/132681/20330716/a9446ecc-ab98-11e6-89b7-8c55a5abb46e.gif)

### Abstract

State Machine is a library for managing a finite set of states, and moving between them via actions and transitions.

From its intuitive configuration through its powerful event-based architecture and rich API, State Machine makes it easy to describe and manage interaction with complex state-dependent systems like components, multi-step forms, purchase funnels, visualisations or games.

### Features

State Machine has been designed from the outset to feel intuitive and fun to use:

- Easily-configurable via JavaScript config or instance methods
- DSL for shorthand transition and handler assignment
- Add and remove states and actions on the fly
- Pause, resume, cancel or end transitions at any point
- Handle system, state, action and transition events
- Rich API and system introspection
- Object-oriented architecture, fully-inspectable in DevTools


### Demo

View the live demo at:

- [statemachine.davestewart.io](http://statemachine.davestewart.io)

To run / tinker with the demo locally, see the Development section.

### Installation

State Machine can be used directly in the browser, or in a Browserify, Node or ES6 project.

Install via NPM using:

```
npm install state-machine
```


**Note**: If you are expecting the package [wheeyls/stateMachine](https://github.com/wheeyls/stateMachine) it has now been deprecated.
To continue to use *that* package in your project, ensure you use the version `0.3.0` in your `package.json`.


### Docs

View the documentation at:

- [docs/readme.md](docs/readme.md)


## Development

### Installation

Clone the repo using:

```
git clone https://github.com/davestewart/javascript-state-machine
```

### Tasks

The following NPM tasks are available, via `npm run <task>`:

- `dev` - compile and watch the source to `state-machine.js`
- `build` - compile the source to `state-machine.min.js`
- `demo` - compile, watch and copy the development build to `demo/` and serve demo files at `http://localhost:8888`
- `test` - run all tests


### Testing

To run a single or set of tests, use the following syntax:

- `npm run test -- --grep="<filename>"`


## Mentions

Inspired by [@jakesgordon](https://github.com/jakesgordon/javascript-state-machine/)'s JavaScript State Machine.

Special thanks to Michael Wheeler ([@wheeyls](https://github.com/wheeyls)) who very kindly donated the NPM package name [state-machine](https://www.npmjs.com/package/state-machine).
