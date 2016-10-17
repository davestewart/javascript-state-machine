import Events from './Events';
import { isFunction } from './utils/utils';

/**
 * Transition class
 *
 * Responsible for managing events in the flow from state to state.
 *
 * The default dispatch order for all transitions is:
 *
 * - '*.start'
 * - ':action.start'
 * - ':state.leave'
 * - '*.leave'
 * - '*.enter'
 * - ':state.enter'
 * - ':action.end'
 * - '*.end'
 *
 * This can be changed by calling Transition.setOrder( ... )
 *
 * Event handlers will receive an Event object, along with any passed parameters (from do()) as ...rest parameters.
 *
 * From a callback, you can:
 *
 * - return false to cancel the transition
 * - return true to pause the transition
 * - not return a value (the transition continues)
 *
 * All transitions can be paused, resumed, or cancelled by calling
 * the appropriate method on, or from:
 *
 * - the event
 * - the transition
 * - the state machine
 *
 * Cancelled transitions will reset the FSM to the previous "from" state
 *
 * When the last callback has fired, the main FSM's end() handler will be called and the state will updated
 *
 * @param {string}          action
 * @param {string}          from
 * @param {string}          to
 * @param {Function[]}      handlers
 * @param {Object}          callbacks
 * @constructor
 */
function Transition (action, from, to, handlers, callbacks)
{
    this.action     = action;
    this.from       = from;
    this.to         = to;
    this.handlers   = handlers;
    this.callbacks  = callbacks;
}

Transition.prototype =
{
    action      : '',
    from        : '',
    to          : '',
    handlers    : null,
    callbacks   : null,
    paused      : false,

    clear: function ()
    {
        this.paused = false;
        this.handlers = [];
    },

    /**
     * Execute the next event's callbacks
     * @returns {*}
     */
	exec: function ()
	{
	    if( ! this.paused )
        {
            if(this.handlers.length)
            {
                var handler = this.handlers.shift();
                var state = handler();
                if(state === false)
                {
                    return this.callbacks.cancel();
                }
                if(state === true)
                {
                    return this.callbacks.pause();
                }
                this.exec();
            }
            else
            {
                this.callbacks.end();
            }
        }
        return this;
	},

    pause: function ()
    {
        this.paused = true;
        return this;
    },

    resume: function ()
    {
        this.paused = false;
        return this.exec();
    }
};

/**
 *
 * @type {string[]} subject.verb
 */
let defaultOrder = [
    '*.start',
    'action.start',
    'from.leave',
    '*.leave',
    '*.enter',
    'to.enter',
    'action.end',
    '*.end'
];

Transition.order = defaultOrder;

export default
{
    /**
     * Create the Transition object
     *
     * - Set up variables, callbacks and queue
     * - Determine paths to relevant callbacks
     * - Build State and Action Event objects
     * - Pre-bind all handlers
     * - Append to queue
     *
     * @param {StateMachine}    fsm
     * @param {string}          action
     * @param {Array}           params
     * @returns {Transition}
     */
    create:function (fsm, action, params)
    {
        // transition
        var from    = fsm.state;
        var to      = fsm.actions.get(action)[from];
        var target  = fsm.target;

        // handle "to" being a function
        if(isFunction(to))
        {
            let actions = fsm.getActionsFor();
            let state   = to.apply(target, [actions].concat(params));
            let action  = fsm.getActionsFor(state);
            // TODO debug this! It's wrong
            if( ! action )
            {
                throw new Error('Cannot go to state "' +state+ '" from current state "' +from+ '"');
            }
        }

        // callbacks
        var callbacks =
        {
            cancel   :fsm.cancel.bind(fsm),
            pause    :fsm.pause.bind(fsm),
            resume   :fsm.resume.bind(fsm),
            end      :fsm.end.bind(fsm)
        };

        // build handlers array
        var queue   = [];
        Transition.order.map( token =>
        {
            // determine path variables
            let [subject, verb]     = token.split('.'); // i.e. *.start, to.enter, action.end
            let type                = /^(start|end)$/.test(verb) ? 'action' : 'state';
            let name;
            if(subject === '*')
            {
                name = '*';
            }
            else if(type == 'action')
            {
                name = action;
            }
            else
            {
                name = verb === 'leave'
                    ? from
                    : to;
            }

            // get handlers
            let path = [type, name, verb].join('.');
            let handlers = fsm.handlers.get(path);
            if(handlers)
            {
                // pre-bind handlers, targets and params
                // this way scope and params don't need to be passed around
                handlers = handlers.map( handler =>
                {
                    return function()
                    {
                        let event = Events.create(type, callbacks, name, verb, from, to);
                        handler.apply(target, [event].concat(params));
                    }
                });

                // add to queue
                queue = queue.concat(handlers);
            }

        });

        // create
        return new Transition(action, from, to, queue, callbacks);
    }

}

