# Usage

## Overview

Using JavaScript State Machine in your application is easy. 

This basic usage example discusses how to set up a basic multi-step form, with the state machine controlling what states (screens) are shown, and which buttons should available.

![multi-step-form](https://cloud.githubusercontent.com/assets/132681/20497487/4590265e-b021-11e6-95f4-44c878615c57.png)

To see this example in action, view the [multi-step form](http://statemachine.davestewart.io/html/examples/systems/sign-up.html) demo.

A quick recap on before starting:

- form steps / screens map directly to state machine states
- form buttons map directly to state machine actions
- configure state machine transitions to describe the relation between the two
- add button event handlers to call state machine actions and update the state machine
- add state machine event handlers to update the user interface when state changes

The key to setting up this form is the transition configuration:

```javascript
transitions: [
    'next   : intro > settings > complete',
    'back   : intro < settings            < error',
    'error  :         settings >            error'
]
```

This describes to the state machine what states are available, and how to navigate between them.

The additional code is simply a bit of jQuery to wire up the UI, and some to submit the form.

This might seem like a simple example that you may think wouldn't be too much code to set up, but the beauty lies where navigation and decision-making complexity increases. Rather than adding a bunch of `if/else` code or `switch` statements to your code, you handle pretty much everything with transition and handler configuration, so even [complex systems](http://statemachine.davestewart.io) become simple.

## HTML

First of all, let's put some HTML on the page: 

```html
<section id="states">
    <article id="intro"> ... </article>
    <article id="settings"> ... </article>
    <article id="summary"> ... </article>
    <article id="error"> ... </article>
</section>

<section id="controls">
    <button name="back">Back<button>
    <button name="next">Next<button>
</section>
```
    
There are two blocks here, `#states` and `#controls`: 

- the `#states` block shows our individual form states, and will be updated by jQuery via events from StateMachine
- the buttons in the `#controls` block will be wired up with jQuery to call actions directly on our StateMachine instance

## JavaScript

Here's the code to update the UI:

```javascript
var ui = {

    start: function () 
    {
        $('#controls button')
            .on('click', function(i, button) {
                fsm.do(button.name);
            });
    },
    
    change: function (event, fsm) 
    {
        // update states
        $('#states article')
            .hide()
            .filter('#' + event.target)
            .show();
    
        // update buttons
        $('#controls button')
            .each(function (i, e) {
                $(e).toggleAttr('disabled', !fsm.can(e.name));  
            });
        }
}
```

Here's the code for the application:

```javascript
var app = {

    submit: function (event, fsm) 
    {
        // cancel if the form didn't validate
        if( ! this.validate() ) 
        {
            return false; // alternative to fsm.cancel()
        }

        // pause transition to complete async action
        fsm.pause();
        
        // post to server
        $.post('/signup/submit.php', $('form').serialize())
            .then(function() 
            {
                fsm.resume();    // resume transition to complete state
            })
            .fail(function() 
            {
                fsm.do('error'); // cancel transition and go to the error state
            });
    }

    validate: function () { ... },
    
    complete: function ()
    {
        alert('congrats!');
    }
}
```

Here's the code for the StateMachine itself:

```javascript
var fsm = new StateMachine({

    transitions: 
    [
        'next   : intro > settings >         complete',
        'back   : intro < settings < error',
        'error  :         settings > error'
    ],
    
    handlers: 
    {
        // wire up buttons on start
        'start' : ui.start,
        
        // update ui when state changes
        'change': ui.update,
        
        // validate form when next clicked on settings state
        'settings@next': app.submit,
        
        // called automatically when we hit the final state (complete)
        'complete': app.complete
    }
});
```
Note that there is absolutely no **navigation logic** in any of this code; the transitions configuration is all you need.  

The jQuery code is just a simple mapping of user input from the `<button>` elements to the `StateMachine` and the resulting state to the `<article>` elements.

The handlers block is virtually empty, delegating all application logic such as validating forms and submitting (or not submitting!) data, including an *asynchronous transition* whilst we wait for a response from the (hypothetical) server.

Note that this example is highly decoupled, but you could equally put the methods within the options block itself (as most of the demos do).

## Links

The following links provide further reading / experimentation:

- The StateMachine [demos](http://statemachine.davestewart.io) for interactive demos on all aspects of StateMachine operation
- More information on basic [options](../config/options.md) and [transitions](../config/transitions.md) configuration
- More information on responding to changes in state via [handlers](../config/handlers.md) and [events](../api/events) 
- Information about the [StateHelper](http://statemachine.davestewart.io/html/setup/index.html) class and how you can use it for quickly wiring up UIs