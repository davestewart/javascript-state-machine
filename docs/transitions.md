# Transitions

## Theory

Transitions are mechanism by which the StateMachine models changes in state.

A transition is described by an `action` such as "next" and a start and end `state` such as "a" and "b":


```
+-----------+            +-----------+    next    +-----------+ 
|           |    next    |           |  ------->  |           | 
|     a     |  ------->  |     b     |            |     c     | 
|           |            |           |  <-------  |           | 
+-----------+            +-----------+    back    +-----------+ 
```


```
next : a > b > c
back :     b < c
```

The actual transit is expressed inside the `StateMachine` as events of the component parts:

- The action has a `start` and `end` event
- The states have a `leave` and `enter` event

As the transition executes, the events occur in this order:
 
1) `action.start` 
2) `state.leave` 
3) `state.enter` 
4) `action.end`

Illustrated like so:

    +-----------+     +-----------+
    |           |     |           |
    |     1 --- 2 --- 3 --> 4     |
    |           |     |           |
    +-----------+     +-----------+

These events give us a mechanism to hook into state changes, either at the `action` or `state` level, allowing us to run code and crucially *control* transitions, either cancelling, pausing or resuming by registering and running handler functions:

    +-----------+     +-----------+
    |           |     |           |
    |     a --------> x     b     |  not allowed to enter state b
    |           |     |           |
    +-----------+     +-----------+

As such, the Transition class itself is a *queueing system* for event handlers, with functionality to pause, resume and cancel the queue.


## Practice

Handlers are added to transitions by by the `fsm.on(pattern, fn)` method.

Handlers can be attached to all states and handlers with `*` or named states and actions such as `intro`.
 
Additionally, the [handler syntax](config/handlers.md) allows attaching handlers to any action or state event such as `action.start` or `state.enter`.


This gives use the following available hooks for any transition, which by default run in this order:

    action.*.start
    action.{action}.start
    state.*.{action}
    state.{from}.{action}
    state.{from}.leave
    state.*.leave
    state.*.enter
    state.{to}.enter
    action.{action}.end
    action.*.end

This might seem like a lot of function calls, but functions are *only* called if registered.

Like normal event handlers, you can add as many handlers per hook as you need to; they are called in the order they are added.

Note the special `state.action` entry, which conveniently allows you to attach handlers for actions directly to states:

```
fsm.on('form@next', onSubmitForm);
```

In practice, you'll likely only hook into a few events.

## Links

See the following links for more information:

- The [StateMachine API](api/statemachine) to add and remove event handlers
- The [handlers](config/handlers.md) section for more information on event handler pattens 
- The [events](config/handlers.md) section for how to write event handlers that interact with your application
- The [demo](http://statemachine.davestewart.io/html/api) site (and [source code](../demo)) for various examples of all of the above
