# Setup

## Installation

Install the package via NPM:

```
npm install state-machine
```

## Setup

State Machine can be used directly in the browser, in a Browserify, Node or ES5 project.

### Browser

For direct browser use, copy the minified file from `dist/` and load via a script tag:

```html
<script src="dist/state-machine.min.js"></script>
```

Then instantiate the State Machine elsewhere:

```html
<script>
    var fsm = new StateMachine(options);
</script>
```

### Browserify / Node

For Node or Browserify, require and instantiate depending on your requirements:

```js
// state machine
var StateMachine = require('state-machine').StateMachine;
var fsm = new StateMachine(options);

// helper
var StateHelper = require('state-machine').StateHelper;
StateHelper.object(fsm);
```

### ES6

For an ES6 project, import and instantiate depending on your requirements:

```js
// default import
import StateMachine from 'state-machine';

// named imports
import { StateMachine, StateHelper } from 'state-machine';

// state machine
const fsm = new StateMachine(options);

// helper
StateHelper.object(fsm);
```

