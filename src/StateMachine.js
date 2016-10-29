import ValueMap from './utils/ValueMap';
import Transition from './Transition';
import TransitionMap from './TransitionMap';
import Config from './Config';
import { SystemEvent, TransitionEvent } from './Events';
import { isFunction } from './utils/utils';
import { parse } from './utils/handlers'

window.ValueMap = ValueMap;

export default function StateMachine (scope, options)
{
    // logic
    this.transitions    = new TransitionMap();
    this.handlers       = new ValueMap();

    // state
    this.state          = '';

    // allow [scope, config] or [config] as parameters
    if(arguments.length == 1)
    {
        [options, scope] = [scope, this];
    }

    // if no options, create default
    if(!options)
    {
        options = {};
    }

    // assign default scope if not set
    if(!options.scope)
    {
        options.scope = scope;
    }

    // initialize
    this.initialize(options);

    // dispatch change event
    if(!this.config.defer)
    {
        this.update('system', 'change', 'state', this.state);
    }
}

StateMachine.parse = parse;

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
    // ------------------------------------------------------------------------------------------------
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
         * Map of all handler functions
         *
         * @var {ValueMap}
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


    // ------------------------------------------------------------------------------------------------
    // private methods

        /**
         * Initialize the FSM with a config object
         *
         * @private
         * @param options
         */
        initialize:function (options)
        {
            // build config
            let config  = new Config(options);
            this.config = config;

            // pre-process all transitions
            let transitions = [];
            if(Array.isArray(options.transitions))
            {
                options.transitions.map( tx =>
                {
                    transitions = transitions.concat(config.parseTransition(tx));
                });
            }

            // add transitions
            transitions.map( transition =>
            {
                this.transitions.add(transition.name, transition.from, transition.to);
            });

            // get initial state (must be done after state collation)
            if( ! config.initial )
            {
                config.initial = this.transitions.getStates()[0];
            }

            // set initial state, unless defer is set to true
            if( ! config.defer )
            {
                this.state = config.initial;
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

            // pre-bind transition handlers
            'pause resume cancel end reset'
                .match(/\w+/g)
                .forEach(fn => this[fn] = this[fn].bind(this));

            // return
            return this;
        },

        /**
         * Dispatch an event
         *
         * @param   {string}    namespace
         * @param   {string}    type
         * @param   {string}    key
         * @param   {*}         value
         * @returns {StateMachine}
         */
        update: function (namespace, type, key = '', value = null)
        {
            let signature = namespace + '.' + type;
            let event = namespace === 'system'
                ? new SystemEvent(type, key, value)
                : new TransitionEvent(type);
            this.dispatch(signature, event);
            return this;
        },


    // ------------------------------------------------------------------------------------------------
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
                if(action === this.config.defaults.initialize)
                {
                    this.update('system', 'initialize');
                }
                this.update('system', 'update', 'transition', this.transition);
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
                    this.transition = Transition.force(this, state);
                    return this.end();
                }
                var action = this.transitions.getActionTo(this.state, state);
                if(action)
                {
                    return this.do(action);
                }
                this.config.debug && console.warn('No transition exists from "%s" to "%s"', this.state, state);
            }
            return false;
        },

        /**
         * Query a transition to see if a named action is available
         *
         * @param   {string}        action
         * @returns {boolean}
         */
        canDo: function (action)
        {
            return this.transitions.has(this.state, action);
        },

        /**
         *
         * @param to
         * @return {boolean}
         */
        canGo: function (to)
        {
            return this.transitions.getActionTo(this.state, to) !== null;
        },

        /**
         * Test if a state exists
         *
         * @param   {string}    state
         * @return  {boolean}
         */
        has: function(state)
        {
            if( ! this.transitions.hasState(state) )
            {
                this.config.debug && console.warn('No such state "%s"', state);
                return false;
            }
            return true;
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


    // ------------------------------------------------------------------------------------------------
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


    // ------------------------------------------------------------------------------------------------
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
                this.update('transition', 'pause');
                this.update('system', 'update', 'pause', true);
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
                this.update('transition', 'resume');
                this.update('system', 'update', 'pause', false);
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
                if(this.isPaused())
                {
                    this.update('system', 'update', 'pause', false);
                }
                this.state = this.transition.from;
                this.transition.clear();
                delete this.transition;
                this.update('transition', 'cancel');
                this.update('system', 'update', 'transition', null);
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
                if(this.isPaused())
                {
                    this.update('system', 'update', 'pause', false);
                }
                this.state = this.transition.to;
                this.transition.clear();
                delete this.transition;
                this.update('system', 'change', 'state', this.state);
                this.update('system', 'update', 'state', this.state);
                if(this.isComplete())
                {
                    this.update('system', 'complete');
                }
                this.update('system', 'update', 'transition', null);
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
            this.update('system', 'reset');
            if(this.transition)
            {
                if(this.isPaused())
                {
                    this.update('system', 'update', 'pause', false);
                }
                this.transition.clear();
                delete this.transition;
                this.update('transition', 'cancel');
                this.update('system', 'update', 'transition', null);
            }
            if(this.state !== state)
            {
                this.state = state;
                this.update('system', 'change', 'state', this.state);
                this.update('system', 'update', 'state', this.state);
            }
            return this;
        },


    // ------------------------------------------------------------------------------------------------
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
            this.transitions.add(action, from, to);
            let states = this.transitions.getStates();
            this.update('system', 'add', 'states', states);
            this.update('system', 'update', 'states', states);
            return this;
        },

        /**
         * Remove a transition
         *
         * @param   {string}    state
         * @return  {StateMachine}
         */
        remove: function (state)
        {
            this.handlers.remove('state.' + state);
            this.transitions.remove(state);
            let states = this.transitions.getStates();
            this.update('system', 'remove', 'states', states);
            this.update('system', 'update', 'states', states);
            return this;
        },


    // ------------------------------------------------------------------------------------------------
    // handlers

        /**
         * Add an event handler
         *
         * Event handler signatures are build from the following grammar:
         *
         * - token      foo
         * - property   .foo
         * - event      :foo
         * - action     @foo
         * - targets    (foo|bar|baz)
         *
         * For example:
         *
         * - change
         * - transition.pause
         * - next:end
         * - (a|b)@next
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
            /** @type {ParseResult} */
            let result = parse(this, id);

            if(this.config.debug)
            {
                console.log('StateMachine on: ' + id, [result.namespace, result.type], result.paths)
            }

            result.paths.map( (path, index) =>
            {
                let target = result.targets[index];

                // warn for invalid actions / states
                if(target !== '*')
                {
                    if(result.namespace === 'state')
                    {
                        if(!this.transitions.hasState(target))
                        {
                            this.config.debug && console.warn('StateMachine: Warning assigning state.%s handler; no such state "%s"', result.type, target);
                        }
                    }
                    else if(result.namespace === 'action')
                    {
                        if(!this.transitions.hasAction(target))
                        {
                            this.config.debug && console.warn('StateMachine: Warning assigning action.%s handler; no such action "%s"', result.type, target);
                        }
                    }
                }

                // check handler is a function
                if(!isFunction(fn))
                {
                    throw new Error('Error assigning ' +result.namespace+ '.' +result.type+ ' handler; callback is not a Function', fn);
                }

                // assign
                this.handlers.insert(path, fn);
            });

            return this;
        },

        off: function (id, fn)
        {
            let result = parse(this, id);
            result.paths.map( path =>
            {
                this.handlers.remove(path, fn)
            });
        },

        dispatch: function(path, event)
        {
            this.config.debug && console.info('StateMachine: dispatch "%s"', path);
            let handlers = this.handlers.get(path);
            if(handlers)
            {
                handlers.map(fn => fn(event, this) );
            }
        }

};
