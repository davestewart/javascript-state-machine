Describing a state machine


Any system can be described in its most basic form by 2 things; states and actions.

The states are where you are, and the actions indicate where you want to go, for example:

```
WELCOME > next > FORM > submit > FINISH
```

If you think about a system in terms of a flow chart:

- the States are the nodes within the chart
- the Actions are the choices or decisions made to move from one state to another
- a derived property, called a Transition, describes the collective action, from and to states

Transitions within a system are by their very nature, unique (if you described going from one state to another using the same action, you have the same transition)

States are also unique; a game of Snakes and Ladders has 100 squares, a sign-up process has, say, 4 screens.




Actions, however, don't need to be unique. You can (but don't have to) use the same action from different states.

Take a board game fr example; the action "next" is the same for all sqaures, but the "start" and "end" squares (or states) is different for each throw of the dice.




By describing a system as a set of states, linked by transitions triggered by actions, you gain a simple yet robust vocabulary to both describe and navigate increasingly-complex systems with relative ease.


States machines become even more useful when you add conditions to transitions; pausing, cancelling or changing target states in response to user input or other logic, you're able to model complex behaviours again, with just a simple set of rules.




Real world example


- be it a sign-up process or a game character animation sequence -


The system is called a "finite" state machine, as you have a finite number of states; you everything before you start, and there are no unknowns