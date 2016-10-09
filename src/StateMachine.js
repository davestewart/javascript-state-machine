import ValueMap from './utils/ValueMap';
import Transition from './Transition';
import { ChangeEvent } from './Events';
import { isString, isArray, isFunction } from './utils/utils';

export default function StateMachine (target, config)
{
    this.target         = target;
    this.state          = '';
    this.states         = [];
    this.transitions    = new ValueMap();
    this.actions        = new ValueMap();
    this.handlers       = new ValueMap();
    if(config)
    {
        this.initialize(config);
        this.update('started');
    }
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
    // ------------------------------------------------------------------------------------------------
    // properties

        /**
         * Available state names
         *
         * - [
         *     intro,
         *     settings,
         *     summary,
         *     final
         *   ]
         *
         * @var {string[]}
         */
        states      : null,

        /**
         * Available transitions for each action
         *
         * action.from => to
         *
         * - next: {
         *     intro: settings,
         *     settings: summary
         *   },
         * - back: {
         *     settings: intro
         *   },
         * - restart: {
         *     summary:intro
         *   },
         * - finish: {
         *     summary:final
         *   },
         *
         * Transitions can also be functions
         *
         * - next: {
         *     intro: function() { return '<random state>' } // jump to a random state
         *   }
         *
         * @var {ValueMap}
         */
        transitions : null,

        /**
         * Actions that are available to be called from each state
         *
         * state => [ action, action, ... ]
         *
         * - intro: [
         *     'next'
         *   ],
         * - settings: [
         *     'next',
         *     'back'
         *   ],
         * - summary: [
         *     'restart'
         *     'finish',
         *   ]
         *
         * Actions can also be expressed as wildcards
         *
         * - intro: [
         *     '*' // any action is allowed from intro
         *   ]
         *
         * @var {ValueMap}
         */
        actions     : null,

        /**
         * Handler functions that should be called on each action event / state change
         *
         * name.type => [ handler, handler, ... ]
         *
         * - next: {
         *   - start: [
         *       hideModal
         *     ],
         *   - end: [
         *       showModal
         *     ]
         *   },
         * - summary: {
         *   - enter: [
         *       resetForm
         *     ],
         *   - leave: [
         *       validateForm,
         *       postData,
         *     ]
         *   },
         *   ...
         *
         * @var {ValueMap}
         */
        handlers   : null,

        /**
         * The current state
         *
         * @var {string}
         */
        state       : '',

        /**
         * Any active Transition object that is driving the state change
         *
         * @var {Transition}
         */
        transition  : null,

        /**
         * The target context in which to call all handlers
         *
         * @var {*}
         */
        target      : null,

        /**
         * The original config object
         *
         * @var {Object}
         */
        config      : null,


    // ------------------------------------------------------------------------------------------------
    // private methods

        /**
         * Initialize the FSM with a config object
         *
         * @private
         * @param config
         */
        initialize:function (config)
        {
            // assign config
            this.config     = config;

            // parse all states
            addStates(this, 'from', config.events);
            addStates(this, 'to', config.events);

            // initial state
            if( ! config.initial )
            {
                config.initial = this.states[0];
            }

            // add transitions
            config.events.map( event =>
            {
                // shorthand
                if(isString(event))
                {
                    let matches = event.match(/(\w+)\s*[\|:=]\s*(\w+)\s*([<>-])\s*(\w.*)/);
                    let [,name, from, op, to] = matches;
                    if(op === '-')
                    {
                        this.add(name, from, to);
                        this.add(name, to, from);
                        return;
                    }
                    if(op === '<')
                    {
                        [from, to] = [to, from];
                    }
                    this.add(name, from, to);
                }

                // keys
                else
                {
                    this.add(event.name, event.from, event.to);
                }
            });

            // add handlers
            for(let name in config.handlers)
            {
                if(config.handlers.hasOwnProperty(name))
                {
                    var handler    = config.handlers[name];
                    var matches     = name.match(/(\w+)\s*(.*)/);
                    if(matches)
                    {
                        let [, type, param] = matches;
                        switch(type)
                        {
                            case 'start'    :this.onStart(param, handler); break;
                            case 'end'      :this.onEnd(param,   handler); break;
                            case 'leave'    :this.onLeave(param, handler); break;
                            case 'enter'    :this.onEnter(param, handler); break;
                            default:
                                this.config.debug && console.warn('Warning processing handlers config: unknown action type "' +type+ '"');
                        }
                    }
                    else
                    {
                        this.config.debug && console.warn('Warning processing handlers config: unable to parse action key "' +name+ '"');
                    }
                }
            }

            // state
            if( ! config.defer )
            {
                this.state = config.initial;
            }

        },

        /**
         * Dispatch an update event
         *
         * @param type
         */
        update: function (type)
        {
            this.config.debug && console.info('StateMachine update "%s"', type);
            let handlers = this.handlers.data.change;
            if(handlers)
            {
                let event = new ChangeEvent(type);
                handlers.map(fn => fn(event) );
            }
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
            if(this.can(action))
            {
                this.config.debug && console.info('Doing action "%s"', action);
                this.transition = Transition.create(this, action, rest);
                this.update('transitioning');
                this.transition.exec();
                return true;
            }
            return false;
        },

        /**
         * Attempt to go to a state
         *
         * Finds if an appropriate transition exists, then calls the related action if it does
         *
         * @param   {string}    state
         * @returns {boolean}
         */
        go: function (state)
        {
            if(this.has(state))
            {
                var action = this.getActionForState(state);
                if(action)
                {
                    return this.do(action);
                }
                this.config.debug && console.info('No transition exists from "%s" to "%s"', this.state, state);
            }
            else
            {
                this.config.debug && console.warn('No such state "%s"', state);
            }
            return false;
        },

        /**
         * Query a transition to see if a named action is available
         *
         * @param   {string}    action
         * @returns {boolean}
         */
        can: function (action)
        {
            if( ! this.actions.has(action) )
            {
                this.config.debug && console.warn('No such action "%s"', action);
            }
            return !! this.transitions.has(this.state, action);
        },

        /**
         * Query a transition to see if a named action is unavailable
         *
         * @param   {string}    action
         * @returns {boolean}
         */
        cannot: function (action)
        {
            return ! this.can(action);
        },

        /**
         * Test if the current state is the same as the supplied one
         *
         * @param   {string}    state       A state name to compare against the current state
         * @returns {boolean}
         */
        is: function (state)
        {
            if(this.states.indexOf(state) === -1)
            {
                this.config.debug && console.warn('No such state "%s"', state);
            }
            return state === this.state;
        },

        /**
         * Test if a state exists
         *
         * @param   {string}    state
         * @return  {boolean}
         */
        has: function(state)
        {
            return this.states.indexOf(state) !== -1;
        },

        /**
         * Get the available "to" states for the current or supplied state
         *
         * @param   {string}    [state]     Optional name of a state to get states for. Defaults to the current state
         * @returns {string[]}              An array of string states
         */
        getStatesFor: function (state = null)
        {
            state       = state || this.state;
            let actions = this.getActionsFor(state, true);
            return Object.keys(actions).map( name => actions[name] );
        },

        /**
         * Get the available actions (or actions and states) for the current or supplied state
         *
         * @param   {string}    [state]     Optional name of a state to get actions for. Defaults to the current state
         * @param   {boolean}   [asMap]     Optional boolean to return a Object of action:state properties. Defaults to false
         * @returns {string[]|Object}       An array of string actions, or a hash of action:states
         */
        getActionsFor: function (state = null, asMap = false)
        {
            state       = state || this.state;
            let actions = this.transitions.get(state || this.state);
            if(asMap)
            {
                let states  = {};
                actions.map( action =>
                {
                    states[action] = this.actions.get(action + '.' + state);
                });
                return states;
            }
            else
            {
                return actions;
            }
        },

        getActionForState: function (state)
        {
            if(this.has(state))
            {
                let actions = this.getActionsFor(null, true);
                for(let action in actions)
                {
                    if(actions[action] === state)
                    {
                        return action;
                    }
                }
            }
            return null
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
         * Test if the FSM is on the "final" state
         *
         * @returns {boolean}
         */
        isFinished: function ()
        {
            return this.state === this.config.final;
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


    // ------------------------------------------------------------------------------------------------
    // transitions

        /**
         * Pause any current transition
         *
         * @returns {StateMachine}
         */
        pause: function ()
        {
            if(this.transition)
            {
                this.transition.pause();
                this.update('paused');
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
            if(this.transition)
            {
                this.update('resumed');
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
                this.transition.clear();
                delete this.transition;
                this.update('cancelled');
            }
            return this;
        },

        /**
         * Complete any current transition, skipping remaining handlers
         *
         * @returns {StateMachine}
         */
        complete: function ()
        {
            if(this.transition)
            {
                this.state = this.transition.to;
                this.transition.clear();
                delete this.transition;
                this.update('transitioned');
                if(this.isFinished())
                {
                    this.update('finished');
                }
            }
            return this;
        },

        /**
         * Reset the FSM to the initial, or supplied, state
         *
         * @returns {StateMachine}
         */
        reset:function(initial)
        {
            this.state = initial || this.config.initial;
            if(this.transition)
            {
                this.transition.clear();
                delete this.transition;
            }
            this.update('reset');
            return this;
        },


    // ------------------------------------------------------------------------------------------------
    // actions

        /**
         * Add a transition event
         *
         * @param   {string}    action
         * @param   {string}    from
         * @param   {string}    to
         * @return  {StateMachine}
         */
        add: function (action, from, to)
        {
            this.actions.set(action + '.' + from, to);
            this.transitions.add(from, action);
            return this;
        },

        remove: function (action, from, to)
        {
            this.states.remove(action, from);
        },


    // ------------------------------------------------------------------------------------------------
    // handlers

        onChange: function (fn)
        {
            this.handlers.add('change', fn);
            return this;
        },

        onStart: function (action, fn)
        {
            addHandler(this, 'action', 'start', action, fn);
            return this;
        },

        onEnd: function (action, fn)
        {
            addHandler(this, 'action', 'end', action, fn);
            return this;
        },

        onEnter: function (state, fn)
        {
            addHandler(this, 'state', 'enter', state, fn);
            return this;
        },

        onLeave: function (state, fn)
        {
            addHandler(this, 'state', 'leave', state, fn);
            return this;
        },

        off: function (type, target, fn)
        {
            return this;
        }

}

/**
 * Parses config and adds unique state names to states array
 *
 * @param {StateMachine}    fsm
 * @param {string}          key
 * @param {Object[]}        transitions
 */
function addStates(fsm, key, transitions)
{
    transitions.map( event => addState(fsm, event[key]) );
}

function addState (fsm, state)
{
    if (isString(state) && fsm.states.indexOf(state) === -1)
    {
        fsm.states.push(state);
    }
}

/**
 * Generic function to parse action and add callback
 *
 * @param {StateMachine}    fsm
 * @param {string}          type
 * @param {string}          verb
 * @param {string|Function} rest
 */
function addHandler(fsm, type, verb, ...rest)
{
    // params
    if(rest.length === 1)
    {
        rest = ['*', rest[0]];
    }
    let [param, fn] = rest;

    // parse states
    let states = isArray(param)
        ? param
        : param == ''
            ? ['*']
            : param.match(/\*|\w+[-\w]+/g);

    // assign handlers
    states.map( subject =>
    {
        // warn for invalid actions / states
        if(subject !== '*')
        {
            if(type === 'state' && fsm.states.indexOf(subject) === -1)
            {
                fsm.config.debug && console.warn('Warning assigning state.%s handler: no such state "%s"', verb, subject);
            }
            else if(type === 'action' && ! fsm.transitions.has(subject))
            {
                fsm.config.debug && console.warn('Warning assigning action.%s handler: no such action "%s"', verb, subject);
            }
        }

        // check handler is a function
        if( ! isFunction(fn) )
        {
            throw new Error('Error assigning ' +verb+ '.' +subject+ ' handler; callback is not a Function', fn);
        }

        // assign
        fsm.handlers.insert([type, subject, verb].join('.'), fn);
    });
}

/*
// event libs
https://www.npmjs.com/package/event-box
https://www.npmjs.com/package/dispatchy
*/

