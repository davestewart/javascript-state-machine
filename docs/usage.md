# Usage

## Overview

Using JavaScript State Machine in your application is easy. 

This basic usage example discusses how to set up a basic multi-step form, with the state machine controlling what states (screens) are shown, and which buttons should available.


## Preamble

A quick recap on StateMachine basics: a StateMachine "transitions" from "state" to "state" via "actions". 

You can think of a small application's screens as its "states" and its user interface controls such as buttons, as "actions".

In this example, our multi-step form has three states represented by HTML `<article>` elements that we will show and hide: `#intro`, `#settings`, `#summary`.
 
There are two actions to move us though the states, represented by HTML `<button>`s, and they are `next` and `back`.

You then create a new StateMachine instance, passing in an options object defining the transitions, along with optional callbacks to run as the system moves from state to state.

You then add code inside the callbacks to show and hide the HTML elements in response to the StateMachine's availale states and actions.

At no point do you need to worry about the logic for this; the StateMachine works it all out!

## HTML

First of all, let's put some HTML on the page to interact with: 

    <section id="states">
        <article class="state" id="intro"> ... </article>
        <article class="state" id="settings"> ... </article>
        <article class="state" id="summary"> ... </article>
    </section>
    
    <section id="controls">
        <button name="back">Back<button>
        <button name="next">Next<button>
    </section>
    
There are two blocks here, `#states` and `#controls`. 

The buttons in the `#controls` block will be wired to tell the StateMachine what to do, and the `#states` block is the one we will update when the StateMachine moves from state to state and calls our handler functions.

## JavaScript

Here's the code for the StateMachine itself:

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
        // wire up buttons on start
        'start' : function () {
            $('#controls button').on('click', function(i, button) {
                    fsm.do(button.name);
                });
        },
        
        // update ui when state changes
        'change': function(event, fsm)
        {
            // update states
            $('#states article')
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
Note that apart from the `transitions` block at the start there is absolutely no **logic** within the code relating to state.  

The only state-related code is in the `change` handler, which loops over the `<article>` and `<button>` elements using jQuery, and shows/hides or enables/disables them according to what states / actions are available.

The remaining handlers respond handle application logic such as validating forms and submitting data. 

Note that handlers can be placed inside or outside the state machine instance; in this case they are inside for brevity.


## Summary

In brief:

- State and actions are expressed through simple configuration
- Logic regarding current state and available states and actions is managed by the StateMachine
- Event handlers run application logic in response to actions or state changes


## Links

The following links provide further reading / experimentation:

- The StateMachine [demos](http://statemachine.davestewart.io) for interactive demos on all aspects of StateMachine operation
- More information about [helpers](http://statemachine.davestewart.io/html/setup/index.html)
- More information about [lifecycle hooks](api/events)
- Check the sections on configuration to see more on basic setup

