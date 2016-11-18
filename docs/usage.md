# Usage

## Overview

Using JavaScript State Machine in your application is easy. 

You create a new StateMachine instance, passing in an options object defining the transitions, along with optional callbacks to run as the system moves from state to state.

## JavaScript

A very simple example such as a sign-up form might be managed as follows:

```javascript
var fsm = new StateMachine({

    transitions: 
    [
        // shorthand "action/state" event notation
        'next   : intro > settings > complete',
        'back   : intro < settings'
    ],
    
    handlers: 
    {
        // show correct view when state changes
        'change': function(event, fsm)
        {
            // update states
            $('article.state')
                .hide()
                .filter('#' + event.target)
                .show();
                
            // update buttons
            $('#controls button')
                .each(function(i, e){
                    $(e).toggleAttr('disabled', fsm.can(e.name));  
                })
        },
        
        // validate form
        'settings@next': function (event) 
        {
            // cancel if the form didn't validate
            if( ! validate() ) 
            {
                return false; // alternative to fsm.cancel()
            }

            // pause transition to complete async action
            fsm.pause();
            $.post('/signup/submit.php', $('form').serialize())
                .then(function() { fsm.resume(); })
                .fail(function(){
                    // don't complete the transition
                    fsm.cancel();
                });
        },
        
        // we're done!
        'complete': function (event) 
        {
            alert('congrats!');
        }
    }
});
```

You have additional options to these, such as setting the `this` context of the StateMachine and mixing in additional methods, found in the [Options](config/options.md) page.

## HTML

Any form such as this will need accompanying HTML, with something like the below a good starting point: 

    <section id="states">
        <article class="state" id="intro"> ... </article>
        <article class="state" id="settings"> ... </article>
        <article class="state" id="summary"> ... </article>
    </section>
    
    <section id="controls">
        <button name="back">Back<button>
        <button name="next">Next<button>
    </section>
    
    <script>
        $('button').on('click', function(i, button) {
            fsm.do(button.name);
        });
    </script>


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

