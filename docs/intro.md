# JavaScript State Machine

# Abstract

### Overview

If you've not heard of or used a (finite) state machine (FSM) before, it might sound like an overly-dry programming concept that has little relevance to everyday web development. 

However, a number of common processes such as multi-step wizards, installation processes, sign-ups, shopping carts, product funnels, even game states benefit hugely from the structure a FSM provides.


### Benefits

The first thing you'll notice when managing a system with State Machine is *vastly-less* code in your both application and your components. The minute you offload the decision-making logic to State Machine is the minute you can delete swathes of navigation code, button handlers and stateful CSS, and replace it with a few lines of StateEvent handler code. 

The second thing you'll notice is significantly less brain-ache and bugs due to trying to work out when (and often how) to show screens. State Machine has you determine states, actions and transitions as part of its configuration, and once this is done, it becomes super-easy to reason about the logic of your app or component.

In fact the configuration is so easy, you can *literally* write it out: 

```
transitions: [
    'next    : intro > form > finish',
    'back    : intro < form           < error',
    'error   :         form >           error',
    'restart : intro        < finish'
],
```

The above code is the transition configuration block from one of the demos for a multi-part form.

Targeting handlers to the correct events is also made easy with an event handler-specific DSL:

```
handlers: {
    'form': onForm,
    'form@next': onSubmit,
    '(finish exit)': onFinish
}
```
 
See the [API demos](http://statemachine.davestewart.io/html/api/index.html) for more details.

### Thinking in states

The big difference writing a ton of vanilla JavaScript to manage your app's state and using State Machine is that you need to think in terms of "states" and "actions" right from the off – but rather than being a hindrance, it's actually a major benefit.

By planning states (views), actions (buttons) and handlers (callbacks) in advance, you can:
 
- reason more easily about the overall flow of the system
- clearly see where to handle things like user input, validation, or server calls
- delegate normally spaghetti-like navigation logic to the FSM
- radically clean up your code by handling business logic in action or state-driven callbacks
- trivially derive secondary state for items such as navigation and buttons from the FSM state

The end result is a system where your components are fully decoupled and contain much less code; their job essentially becomes to display data, whilst the logic for navigation and business is managed by, and within, the FSM.


### Benefits

By planning states (views), actions (buttons) and handlers (callbacks) in advance, you can:
 
- reason more easily about the overall flow of the system
- clearly see where to handle things like user input, validation, or server calls
- radically clean up your code by handling business logic in action or state-driven callbacks
- delegate normally spaghetti-like navigation logic to the FSM
- trivially derive secondary state for items such as navigation and buttons from the FSM state

The end result is a system where your components are fully decoupled and contain much less code; their job essentially becomes to display data, whilst the properties that drive navigation (the "state") is managed by, and within, the FSM.

With some initial thought about the steps and actions of your system, it becomes fairly easy to convert that into a simple JavaScript configuration, which the FSM can use to manage your application's state and related interactions.


The first time you set up a state machine, it can feel difficult to mentally-map what you normally do fluidly or intuitively in code, to what feels initially like a rigid structure of states and actions, but it doesn't take too long to begin thinking in this new way, and your project's architecture will thank you.



