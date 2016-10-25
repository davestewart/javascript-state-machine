# Usage

## Overview

Using JavaScript State Machine in your code is easy. 

You create a new StateMachine instance, then assign the states and actions required to move from state to state, along with optional callbacks to run as things change.

A simple example such as a 3 step sign-up form might be as simpled as:

```javascript
var fsm = new StateMachine(target, 
{
    transitions: 
    [
        // shorthand "action/state" event notation
        'next   : intro > settings',
        'next   : settings > summary',
        'finish : summary > complete',
        'error  : summary > sorry'
    ],
    
    handlers: 
    {
        // validate form
        'settings@next': function (event) 
        {
            // cancel if the form didn't validate
            if( ! this.validate() ) 
            {
                return false; // alternative to fsm.pause()
            }
        },
                    
        // submit data
        'summary@next': function (event, fsm) 
        {
            // pause transition to complete async action
            fsm.pause();
            this
                .submit()
                .then(fsm.resume)
                .fail(function(){
                    // cancel and go directly to error state
                    fsm.go('error');
                });
        },
        
        // we're done!
        'complete': function (event) 
        {
            // run internal process to complete
            this.navigate('/new/page.html');
        }
    }
});
```

Transitions are made up of "actions" and "states", with actions being easily mapped to buttons. 

As you can see here there are two "next" actions but referring to different "from" and "to" states. StateMachine determines the correct "to" state for same-named actions by mapping it from the current named state.


There are a wide variety of lifecycle hooks which can have handlers attached, allowing you to:

- run application code
- pause state transitions (perhaps to asynchronously call the server)
- resume or cancel transitions (depending on the response)
- update the UI in response to any change of state


StateMachine's eventful nature and rich API makes it trivial to enable or disable buttons, or update navigation or components as you move from state to state.

## Summary

In a few brief points:

- State and actions are expressed by way of JSON configuration
- Logic regarding state change and resulting allowable actions is delegated entirely to the StateMachine
- Business and application logic is executed in response to action or state events

