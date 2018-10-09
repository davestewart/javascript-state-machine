import { StateEvent, ActionEvent } from '../objects/events';
import { isFunction } from '../utils/utils';

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
 * TransitionMap can also be paused, resumed, or cancelled by calling
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
 * @param {StateMachine}    fsm
 * @param {string}          action
 * @param {string}          from
 * @param {string}          to
 */
function Transition (fsm, action, from, to)
{
    this.fsm        = fsm;
    this.action     = action;
    this.from       = from;
    this.to         = to;
    this.clear();
}

/**
 * @prop {StateMachine}    fsm
 * @prop {string}          action
 * @prop {string}          from
 * @prop {string}          to
 * @prop {Function[]}      handlers
 */
Transition.prototype =
{
    fsm         : null,
    action      : '',
    from        : '',
    to          : '',
    paused      : false,
    handlers    : null,

    clear: function ()
    {
        unpause(this);
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
                    return this.fsm.cancel();
                }
                if(state === true)
                {
                    return this.fsm.pause();
                }
                this.exec();
            }
            else
            {
                this.fsm.end();
            }
        }
        return this;
	},

    pause: function ()
    {
        pause(this);
        return this;
    },

    resume: function ()
    {
        unpause(this);
        return this.exec();
    },

    cancel: function()
    {
        this.paused = false;
        this.fsm.handlers.trigger('transition.cancel', false);
    }

};

function pause(transition)
{
    if(!transition.paused)
    {
        transition.paused = true;
        transition.fsm.handlers.trigger('transition.pause', true);
    }
}

function unpause(transition)
{
    if(transition.paused)
    {
        transition.paused = false;
        transition.fsm.handlers.trigger('transition.resume', false);
    }
}

export default
{
    /**
     * Create the Transition object
     *
     * - Set up variables, and queue
     * - Determine paths to relevant handlers
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
        // transition properties
        let scope   = fsm.config.scope;
        let from    = fsm.state;
        let to      = fsm.transitions.getStateFor(from, action);

        // handle "to" being a function
        if(isFunction(to))
        {
            to = to.apply(scope, [fsm].concat(params));
            if(!fsm.transitions.hasState(to))
            {
                throw new Error('Invalid "to" state "' +to+ '"');
            }
        }

        // transition
        let vars    = {action, to, from};
        let queue       = [];
        let transition  = new Transition(fsm, action, from, to);

        // build handlers array
        fsm.config.order.forEach( path =>
        {
            // replace path tokens
            path = path.replace(/{(\w+)}/g, (all, token) => vars[token]);
            let handlers = fsm.handlers.get(path);

            // do it!
            if(handlers)
            {
                let [namespace, target, type] = path.split('.');
                handlers = handlers.map( handler =>
                {
                    // build event object
                    let Event = namespace === 'state' ? StateEvent : ActionEvent;
                    let event = new Event(type, target, transition);

                    // pre-bind handlers, scopes and params
                    // this way scope and params don't need to be passed around
                    // and the call from Transition is always just `value = handler()`
                    return function()
                    {
                        return handler.apply(scope, [event, fsm].concat(params));
                    }
                });

                // add to queue
                queue = queue.concat(handlers);
            }
        });

        // return
        transition.handlers = queue;
        return transition;
    },

    force: function(fsm, state)
    {
        let transition = new Transition(fsm, '', fsm.state, state);
        transition.paused = fsm.transition ? fsm.transition.paused : false;
        return transition;
    }

}
