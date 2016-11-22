# State Machine

## Demo

### Overview

The demo directory contains individual html files with extensive API and usage examples.

You can view the live demo here:

- [http://statemachine.davestewart.io](http://statemachine.davestewart.io)

### Running the demo locally

To view the demo files, run `npm run demo`. Any changes will be live-reloaded.


### Demo files setup 

All examples first run the same basic setup script which uses the StateHelper class to:
 
 - create a state machine with the passed options
 - wire up the UI to respond to StateMachine events
 - assigns it to the global `fsm`variable so it can be inspected and interacted with from the console
 
This is fully explained in the demos here: 

- [http://statemachine.davestewart.io/html/setup/setup/overview.html](http://statemachine.davestewart.io/html/setup/setup/overview.html)


To understand each of the examples:

-   Open each example in your IDE; all the code is on the page
-   Inspect the HTML using your browser's dev tools
-   Check the console for `debug` messages