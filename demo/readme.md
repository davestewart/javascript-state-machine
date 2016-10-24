# State Machine

## Demo

### Overview

The demo directory contains individual html files with API and usage examples.

API:

- Flows
- States
- Events
- Handlers

Examples:

- Sign-up forms
- Game states
- Animating views
- etc.

### Running the demo

To view the demo files, run `npm run demo`. Any changes will be live-reloaded.


### Grokking the files

All examples first run a basic setup script `demo/assets/js/setup.js` which:

-   Assigns the state machine to the global `fsm`variable
-   Adds an `update` listener to the fsm to:
    -   Update the onscreen state diagram's active state
    -   Enable / disable buttons depending on available actions and `isPaused()` result
- Logs the instance to the console

To understand each of the examples:

-   Open each example in your IDE; all the code is on the page
-   Inspect the HTML using your browser's dev tools
-   Check the console for `debug` messages