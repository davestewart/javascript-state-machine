import Config from './core/classes/Config';
import HandlerMap from './core/maps/HandlerMap';
import TransitionMap from './core/maps/TransitionMap';
import Transition from './core/classes/Transition';
import { diff } from './core/utils/utils';


/**
 * StateMachine constructor
 *
 * @param   {Object|null}    options
 * @constructor
 */
function StateMachine (options)
{
    this.transitions    = new TransitionMap();
    this.handlers       = new HandlerMap(this);
    this.initialize(options);
}

/**
 * StateMachine prototype
 *
 * The property examples below illustrate a 4-state machine, with states:
 *
 * - intro > settings > summary > end
 *
 * And actions:
 *
 * - back | next | restart | finish
 */
StateMachine.prototype =
{
    // -----------------------------------------------------------------------------------------------------------------
    // properties

        /**
         * Configuration object
         *
         * @var {Config}
         */
        config      : null,

        /**
         * Map of all transitions
         *
         * @var {TransitionMap}
         */
        transitions : null,

        /**
         * Map of all handlers
         *
         * @var {HandlerMap}
         */
        handlers    : null,

        /**
         * Any active Transition object that is driving the state change
         *
         * @var {Transition}
         */
        transition  : null,

        /**
         * The current state
         *
         * @var {string}
         */
        state       : '',


    // -----------------------------------------------------------------------------------------------------------------
    // private methods

        /**
         * Initialize the FSM with options
         *
         * @private
         * @param options
         */
        initialize:function (options = {})
        {
            // state
            this.state          = '';

            // build config
            let config  = new Config(options);
            this.config = config;

            // pre-process all transitions
            let transitions = [];
            if(Array.isArray(options.transitions))
            {
                options.transitions.forEach( tx =>
                {
                    transitions = transitions.concat(this.transitions.parse(tx));
                });
            }

            // add transitions
            transitions.forEach( transition =>
            {
                this.transitions.add(transition.action, transition.from, transition.to);
            });

            // get initial state (must be done after state collation)
            if( ! config.initial && this.transitions.length)
            {
                config.initial = this.transitions.getStates()[0];
            }

            // add handlers
            if(options.handlers)
            {
                for(let name in options.handlers)
                {
                    if(options.handlers.hasOwnProperty(name))
                    {
                        this.on(name, options.handlers[name]);
                    }
                }
            }

            // add methods
            if(options.methods)
            {
                if(!this.config.scope)
                {
                    this.config.scope = this;
                }
                for(var name in options.methods)
                {
                    if(options.methods.hasOwnProperty(name) && !this.hasOwnProperty(name))
                    {
                        this[name] = options.methods[name];
                    }
                }
            }

            // start
            if(this.config.start)
            {
                this.start();
            }

            // return
            return this;
        },

        start: function ()
        {
            this.state = this.config.initial;
            this.handlers.trigger('system.start');
            if(this.state)
            {
                this.handlers.trigger('system.change', this.state);
            }
            return this;
        },

        /**
         * Reset the FSM to the initial, or supplied, state
         *
         * @returns {StateMachine}
         */
        reset:function(initial = '')
        {
            let state = initial || this.config.initial;
            this.handlers.trigger('system.reset');
            if(this.transition)
            {
                this.transition.cancel();
                delete this.transition;
            }
            if(this.state !== state)
            {
                this.state = state;
                this.handlers.trigger('system.change', this.state);
            }
            return this;
        },


    // -----------------------------------------------------------------------------------------------------------------
    // api

        /**
         * Attempt to run an action, resulting in a transition to a state
         *
         * @param   {string}    action
         * @param   {*[]}       rest
         * @returns {boolean}
         */
        do: function (action, ...rest)
        {
            if(this.canDo(action) && !this.isPaused())
            {
                this.transition = Transition.create(this, action, rest);
                this.transition.exec();
                return true;
            }
            return false;
        },

        /**
         * Attempt to go to a state
         *
         * Queries TransitionMap instance to see if a transition exists, then calls the related action if it does
         *
         * @param   {string}    state
         * @param   {boolean}   [force]
         * @returns {boolean}
         */
        go: function (state, force = false)
        {
            if(this.has(state))
            {
                if(force)
                {
                    if(this.transition)
                    {
                        this.transition.clear();
                    }
                    this.transition = Transition.force(this, state);
                    return this.end();
                }
                var action = this.transitions.getActionFor(this.state, state);
                if(action)
                {
                    return this.do(action);
                }
                this.config.errors > 0 && console.warn('No transition exists from "%s" to "%s"', this.state, state);
                return false;
            }
            this.config.errors > 0 && console.warn('No such state "%s"', state);
            return false;
        },

        /**
         * Query transition map to see if a named action is available
         *
         * @param   {string}        action
         * @returns {boolean}
         */
        canDo: function (action)
        {
            return this.transitions.getActionsFrom(this.state).indexOf(action) !== -1;
        },

        /**
         * Query transition map to see if a state is available to go to
         *
         * @param to
         * @return {boolean}
         */
        canGo: function (to)
        {
            return this.transitions.getActionFor(this.state, to) !== null;
        },

        /**
         * Test if a state exists
         *
         * @param   {string}    state
         * @return  {boolean}
         */
        has: function(state)
        {
            return this.transitions.hasState(state);
        },

        /**
         * Test if the current state is the same as the supplied one
         *
         * @param   {string}    state       A state name to compare against the current state
         * @returns {boolean}
         */
        is: function (state)
        {
            return state === this.state;
        },


    // -----------------------------------------------------------------------------------------------------------------
    // flags

        /**
         * Test if the FSM has started
         *
         * @returns {boolean}
         */
        isStarted: function ()
        {
            return this.state !== '';
        },

        /**
         * Test if the FSM is transitioning
         *
         * @returns {boolean}
         */
        isTransitioning: function ()
        {
            return !! this.transition;
        },

        /**
         * Test if the FSM is paused (whilst transitioning)
         *
         * @returns {boolean}
         */
        isPaused: function ()
        {
            return this.transition
                ? this.transition.paused
                : false;
        },

        /**
         * Test if the FSM is on the "final" state
         *
         * @returns {boolean}
         */
        isComplete: function ()
        {
            return this.state === this.config.final;
        },


    // -----------------------------------------------------------------------------------------------------------------
    // transitions

        /**
         * Pause any current transition
         *
         * @returns {StateMachine}
         */
        pause: function ()
        {
            if(this.transition && !this.isPaused())
            {
                this.transition.pause();
            }
            return this;
        },

        /**
         * Resume any current transition
         *
         * @returns {StateMachine}
         */
        resume: function ()
        {
            if(this.transition && this.isPaused())
            {
                this.transition.resume();
            }
            return this;
        },

        /**
         * Cancel any current transition
         *
         * @returns {StateMachine}
         */
        cancel: function ()
        {
            if(this.transition)
            {
                this.state = this.transition.from;
                this.transition.cancel();
                delete this.transition;
            }
            return this;
        },

        /**
         * End any current transition, skipping remaining handlers
         *
         * @returns {StateMachine}
         */
        end: function ()
        {
            if(this.transition)
            {
                this.state = this.transition.to;
                this.transition.clear();
                delete this.transition;
                this.handlers.trigger('system.change', this.state);
                if(this.isComplete())
                {
                    this.handlers.trigger('system.complete');
                }
            }
            return this;
        },


    // -----------------------------------------------------------------------------------------------------------------
    // actions

        /**
         * Add a transition
         *
         * @param   {string}    action
         * @param   {string}    from
         * @param   {string}    to
         * @return  {StateMachine}
         */
        add: function (action, from, to)
        {
            // 1 argument: shorthand transition, i.e 'next : a > b'
            if(arguments.length === 1)
            {
                var transitions = this.transitions.parse(action);
                transitions.forEach( tx => this.add(tx.action, tx.from, tx.to));
                return this;
            }

            // 3 arguments: longhand transition
            updateTransitions(this, 'add', () => this.transitions.add(action, from, to) );
            return this;
        },

        /**
         * Remove a state
         *
         * @param   {string}    state
         * @return  {StateMachine}
         */
        remove: function (state)
        {
            this.handlers.remove('state.' + state);
            updateTransitions(this, 'remove', () => this.transitions.remove(state) );
            return this;
        },


    // -----------------------------------------------------------------------------------------------------------------
    // handlers

        /**
         * Add an event handler
         *
         * Event handler signatures are built from the following grammar:
         *
         * - token      foo
         * - property   .foo
         * - event      :foo
         * - action     @foo
         * - targets    (foo bar baz)
         *
         * For example:
         *
         * - change
         * - transition.pause
         * - next:end
         * - (a b)@next
         * - a@next
         *
         * The main event types are unique, so can be used without the namespace:
         *
         * - change
         * - pause
         * - complete
         * - ...
         *
         * If your states and events are unique, they can also be used without qualification.
         *
         * See docs and demo for more information
         *
         * @param   {string}        id
         * @param   {Function}      fn
         * @return  {StateMachine}
         */
        on: function (id, fn)
        {
            this.parse(id, this.config.invalid, this.config.errors)
                .forEach( meta => this.handlers.add(meta.path, fn) );
            return this;
        },

        off: function (id, fn)
        {
            this.parse(id, this.config.invalid, this.config.errors)
                .forEach( meta => this.handlers.remove(meta.path, fn) );
            return this;
        },

    
    // -----------------------------------------------------------------------------------------------------------------
    // utilities

        /**
         * Parses a handler id string into HandlerMeta objects
         *
         * @param   {string}    id
         * @param   {boolean}   invalid
         * @param   {number}    errors
         * @returns {HandlerMeta[]}
         */
        parse: function (id, invalid = false, errors = 0)
        {
            return this.handlers.parse(id).filter(result =>
            {
                // picks up unrecognised handlers, namespaces, etc
                if(result instanceof Error)
                {
                    if(errors == 2)
                    {
                        throw result;
                    }
                    errors == 1 && console.warn(result.message);
                    return false;
                }

                // picks up unrecognised states and actions
                if(result.target !== '*')
                {
                    let error = '';

                    if(result.namespace === 'state')
                    {
                        if(!this.transitions.hasState(result.target))
                        {
                            error = 'Unrecognised state "' +result.target+ '" in handler "' +result.id+ '"';
                        }
                    }
                    else if(result.namespace === 'action')
                    {
                        if(!this.transitions.hasAction(result.target))
                        {
                            error = 'Unrecognised action "' +result.target+ '" in handler "' +result.id+ '"';
                        }
                    }
                    else if(result.namespace === 'state/action')
                    {
                        // variables
                        let [state, action] = result.target.split('@');

                        // test for state and action
                        if(!this.transitions.hasState(state))
                        {
                            error = 'Unrecognised state "' +state+ '" in handler "' +result.id+ '"';
                        }
                        if(!this.transitions.hasAction(action))
                        {
                            error = 'Unrecognised action "' +action+ '" in handler "' +result.id+ '"';
                        }
                    }

                    // if we have an error, the result was not an existing state or action
                    if(error)
                    {
                        if(errors == 2)
                        {
                            throw new Error(error);
                        }
                        errors == 1 && console.warn(error);
                        return !!invalid;
                    }
                }

                // must be valid
                return true
            });
        },

        trigger: function (id, ...rest)
        {
            this.handlers.parse(id).forEach( meta => this.handlers.trigger.apply(this.handlers, [meta.path, ...rest]) );
            return this;
        }

};

StateMachine.prototype.constructor = StateMachine;

export default StateMachine;


// ---------------------------------------------------------------------------------------------------------------------
// static methods

    /**
     * Factory method
     *
     * @param   options
     * @returns {StateMachine}
     */
    StateMachine.create = function(options)
    {
        return new StateMachine(options);
    };

    /**
     * Gets the default order events should be called in
     * @returns {string[]}
     */
    StateMachine.getDefaultOrder = function ()
    {
        return [
            'action.*.start',
            'action.{action}.start',
            'state.*.{action}',
            'state.{from}.{action}',
            'state.{from}.leave',
            'state.*.leave',
            'state.*.enter',
            'state.{to}.enter',
            'action.{action}.end',
            'action.*.end'
        ];
    };


// ---------------------------------------------------------------------------------------------------------------------
// helper functions

    /**
     * Utility method to update transitions and dispatch events
     *
     * Saves duplicating the following code in both add() and remove() methods
     *
     * @param   {StateMachine}  fsm
     * @param   {string}        method
     * @param   {Function}      callback
     */
    function updateTransitions(fsm, method, callback)
    {
        var statesBefore    = fsm.transitions.getStates();
        var actionsBefore   = fsm.transitions.getActions();
        callback();
        var statesAfter     = fsm.transitions.getStates();
        var actionsAfter    = fsm.transitions.getActions();

        // calculate differences
        var states          = diff(statesBefore, statesAfter);
        var actions         = diff(actionsBefore, actionsAfter);

        // dispatch events
        states.forEach ( state  => fsm.handlers.trigger('system.state.'  + method, state) );
        actions.forEach( action => fsm.handlers.trigger('system.action.' + method, action) );
    }
