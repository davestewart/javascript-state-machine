
## Overview

Using JavaScript State Machine in your code is easy. 

You create a new StateMachine instance, then assign the states and actions required to move from state to state, along with optional callbacks to run as things change.

A simple example such as a 3 step sign-up form might be as simpled as:

```javascript
var fsm = new StateMachine(target, 
{
    events: 
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
        'leave settings': function (event) 
        {
            // cancel if the form didn't validate
            if( ! this.validate() ) 
            {
                return false; // alternative to event.pause()
            }
        },
                    
        // submit data
        'leave summary': function (event) 
        {
            // pause transition to complete async action
            event.pause();
            this
                .submit()
                .then(event.resume)
                .fail(function(){
                    // cancel and go directly to error state
                    event.reset('error');
                });
        },
        
        // we're done!
        'end finish': function(event) 
        {
            // run internal process to complete
            this.trigger('complete');
        }
    }
});
```

Events are made up of "actions" and "states", with actions being easily mapped to buttons. 

As you can see here there are two "next" actions but referring to different "from" and "to" states. StateMachine determines the correct "to" state for same-named actions by mapping it from the current named state.


Both action and state verbs (start, end, leave, enter) can have handlers attached, allowing you to:

- run application code
- pause state transitions (for example, to call asynchronous code)
- resume or cancel transitions (depending on the response)

You can attach multiple handlers, not just to pause and cancel actions for example, but to update the UI navigation or reset forms.

StateMachine's public API and event system provides hooks into available actions and states from each state, so it becomes trivial to enable or disable buttons, or update navigation or components as you move from state to state.

The following is a Vue.js example:

```
<component :is="fsm.state"></component>
<nav>
    <button :disabled="{{ ! fsm.can('next') }}"   @click="fsm.do('next')">Next</button>
    <button :disabled="{{ ! fsm.can('finish') }}" @click="fsm.do('finish')">Finish</button>
</nav>
```

In summary:

- Navigation and UI logic is now expressed by way of configuration
- Decision-making logic is offloaded to the StateMachine
- Business and application logic is contained in event handlers

