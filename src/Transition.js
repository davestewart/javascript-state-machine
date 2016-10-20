import Events from './Events';
import { isFunction } from './utils/utils';

/**
 * Transition class
 *
 * Responsible for managing events in the flow from state to state.
 *
 * This adds all handlers for the current action start/end and state from/to to an array:
 *
 * - <namespace>.<target>.<type>[]
 *
 * So going from state "a" to state "b" with action "next" should build:
 *
 * - action.*.start[]
 * - action.next.start[]
 * - state.a.leave[]
 * - state.*.leave[]
 * - state.*.enter[]
 * - state.b.enter[]
 * - action.next.end[]
 * - action.*.end[]
 *
 * This can be changed by passing in an order array in fsm.config
 *
 * Event handlers will receive an Event object, along with any passed parameters (from do()) as ...rest parameters.
 *
 * From a callback, you can:
 *
 * - return false to cancel the transition
 * - return true to pause the transition
 * - not return a value (the transition continues)
 *
 * Transitions can also be paused, resumed, or cancelled by calling
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
        var queue   = [];
        var scope   = fsm.scope;
        var from    = fsm.state;
        var to      = fsm.actions.get(action)[from];
        var callbacks =
        {
            cancel   :fsm.cancel.bind(fsm),
            pause    :fsm.pause.bind(fsm),
            resume   :fsm.resume.bind(fsm),
            end      :fsm.end.bind(fsm)
        };

        // handle "to" being a function
        if(isFunction(to))
        {
            let actions = fsm.getActionsFor();
            let state   = to.apply(scope, [actions].concat(params));
            let action  = fsm.getActionsFor(state);
            // TODO debug this! It's wrong
            if( ! action )
            {
                throw new Error('Cannot go to state "' +state+ '" from current state "' +from+ '"');
            }
        }

        // build handlers array
        fsm.config.order.map( token =>
        {
            // determine path variables
            let [type, source]      = token.split(':'); // i.e. start.*, enter:to, end:action
            let namespace           = /^(start|end)$/.test(type)
                                        ? 'action'
                                        : 'state';
            let target;
            if(source === '*')
            {
                target = '*';
            }
            else if(namespace == 'action')
            {
                target = action;
            }
            else
            {
                target = type === 'leave'
                    ? from
                    : to;
            }

            // get handlers
            let path = [namespace, target, type].join('.');

            let handlers = fsm.handlers.get(path);
            if(handlers)
            {
                // pre-bind handlers, scopes and params
                // this way scope and params don't need to be passed around
                handlers = handlers.map( handler =>
                {
                    return function()
                    {
                        let event = Events.create(namespace, type, target, from, to, callbacks);
                        return handler.apply(scope, [event].concat(params));
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

