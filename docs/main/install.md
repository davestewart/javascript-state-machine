# Installation

## Overview

Depending on your project type, you can install StateMachine and use it as a standalone library, or include it as part of your ES6 build process.

## Non-ES6

For a standalone project, copy the `StateMachine.js` and optionally `StateHelper.js` files from `dist/` to your project, and include them in your build process or reference them with a script tag.

## ES6

For an ES6 project, install via npm:

```
npm install state-machine
```

Then import and instantiate:

```
import StateMachine from 'state-machine'
import { StateHelper } from 'state-machine'

const fsm = new StateMachine({ ... })
```

