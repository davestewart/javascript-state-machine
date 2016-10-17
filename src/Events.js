// ------------------------------------------------------------------------------------------------
// setup

    function noop () { }

    /**
     * @prop {string}  namespace  The Event namespace; i.e. state or action
     * @prop {string}  type       The Event type;      i.e. leave/enter (state) or start/end (action)
     * @prop {string}  target     The Event target;    i.e. intro (state) or next (action)
     * @prop {string}  from       The from state
     * @prop {string}  to         The to state
     */
    let event =
    {
        // properties
        namespace   : null,
        type        : null,
        target      : null,
        from        : null,
        to          : null,

        // transition callbacks
        pause       : noop,
        resume      : noop,
        cancel      : noop,
        complete    : noop
    };

    function initialize (event, namespace, type, target, from, to, callbacks)
    {
        event.namespace = namespace;
        event.type      = type;
        event.target    = target;
        event.from      = from;
        event.to        = to;

        event.pause     = callbacks.pause;
        event.resume    = callbacks.resume;
        event.cancel    = callbacks.cancel;
        event.complete  = callbacks.complete;
    }

    export default
    {
        create: function(namespace, type, target, from, to, callbacks)
        {
            var fn = namespace == 'state'
                ? StateEvent
                : ActionEvent;
            return new fn(type, target, from, to, callbacks);
        }
    }


// ------------------------------------------------------------------------------------------------
// ActionEvent

    export function ActionEvent (type, target, from, to, callbacks)
    {
        initialize(this, 'action' ,type, target, from, to, callbacks);
    }
    ActionEvent.prototype = event;


// ------------------------------------------------------------------------------------------------
// StateEvent

    export function StateEvent (type, target, from, to, callbacks)
    {
        initialize(this, 'state' ,type, target, from, to, callbacks);
    }
    StateEvent.prototype = event;


// ------------------------------------------------------------------------------------------------
// SystemEvent

    export function SystemEvent (type)
    {
        this.type = type;
    }

    SystemEvent.prototype =
    {
        namespace: 'system',
        type: ''
    };


// ------------------------------------------------------------------------------------------------
// TransitionEvent

    export function TransitionEvent (type)
    {
        this.type = type;
    }

    TransitionEvent.prototype =
    {
        namespace: 'transition',
        type: ''
    };

