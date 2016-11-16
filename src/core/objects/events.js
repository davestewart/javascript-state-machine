// ------------------------------------------------------------------------------------------------
// setup

    /**
     * @prop {string}       namespace   The Event namespace; i.e. state or action
     * @prop {string}       type        The Event type;      i.e. leave/enter (state) or start/end (action)
     * @prop {string}       target      The Event target;    i.e. intro (state), next (action), or * (all states or types)
     * @prop {Transition}   transition  The transition which generated the event
     */
    let event =
    {
        // properties
        namespace   : null,
        type        : null,
        target      : null,
        transition          : null
    };

    function initialize (event, namespace, type, target, transition)
    {
        event.namespace     = namespace;
        event.type          = type;
        event.target        = target;
        event.transition    = transition;
    }


// ------------------------------------------------------------------------------------------------
// ActionEvent

    export function ActionEvent (type, target, transition)
    {
        initialize(this, 'action' ,type, target, transition);
    }
    ActionEvent.prototype = event;


// ------------------------------------------------------------------------------------------------
// StateEvent

    export function StateEvent (type, target, transition)
    {
        initialize(this, 'state' ,type, target, transition);
    }
    StateEvent.prototype = event;


// ------------------------------------------------------------------------------------------------
// SystemEvent

    export function SystemEvent (type, value)
    {
        this.type   = type;
        this.value  = value;
    }

    SystemEvent.prototype =
    {
        namespace   : 'system',
        type        : '',
        value       : null
    };


// ------------------------------------------------------------------------------------------------
// TransitionEvent

    export function TransitionEvent (type)
    {
        this.type = type;
    }

    TransitionEvent.prototype =
    {
        namespace   : 'transition',
        type        : ''
    };
