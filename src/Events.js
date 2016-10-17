// ------------------------------------------------------------------------------------------------
// setup

    function noop () { }

    /**
     * @prop {string}  type     The Event type; i.e. state or action
     * @prop {string}  name     The Event subject/name; i.e. intro (state) or next (action)
     * @prop {string}  verb     The Event verb; i.e. leave/enter (state) or start/end (action)
     * @prop {string}  from     The from state
     * @prop {string}  to       The to state
     */
    let event =
    {
        type    : null,
        name    : null,
        verb    : null,
        from    : null,
        to      : null,

        pause   : noop,
        resume  : noop,
        cancel  : noop,
        complete: noop
    };

    function initialize (event, callbacks, type, name, verb, from, to)
    {
        event.type      = type;
        event.name      = name;
        event.verb      = verb;
        event.from      = from;
        event.to        = to;

        event.pause     = callbacks.pause;
        event.resume    = callbacks.resume;
        event.cancel    = callbacks.cancel;
        event.complete  = callbacks.complete;
    }

    export default
    {
        create: function(type, callbacks, name, verb, from, to)
        {
            var fn = type == 'state'
                ? StateEvent
                : ActionEvent;
            return new fn(callbacks, name, verb, from, to);
        }
    }


// ------------------------------------------------------------------------------------------------
// ActionEvent

    export function ActionEvent (callbacks, name, verb, from, to)
    {
        initialize(this, callbacks, 'action' ,name, verb, from, to);
    }
    ActionEvent.prototype = event;


// ------------------------------------------------------------------------------------------------
// StateEvent

    export function StateEvent (callbacks, name, verb, from, to)
    {
        initialize(this, callbacks, 'state' ,name, verb, from, to);
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
        type: ''
    };

