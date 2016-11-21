import ValueMap from './ValueMap';
import parseTransition from '../parsers/TransitionParser'
import { trim } from '../utils/utils'

function TransitionMap ()
{
    this.map        = new ValueMap();
    this.states     = [];
    this.actions    = [];
}

TransitionMap.prototype =
{
    // ------------------------------------------------------------------------------------------------
    // properties

        map     : null,
        states  : null,
        actions : null,


    // ------------------------------------------------------------------------------------------------
    // add and remove states

        /**
         * Add event handler parsing
         *
         * @param   {string}    tx
         * @returns {TransitionMeta[]}
         */
        parse: function (tx)
        {
            return parseTransition(tx);
        },

        /**
         * Adds a new transition
         * 
         * @param   {string}    action
         * @param   {string}    from
         * @param   {string}    to
         * @returns {TransitionMap}
         */
        add: function (action, from, to)
        {
            // procss variables
            action  = trim(action);
            from    = trim(from);
            to      = typeof to === 'string' ? trim(to) : to;

            // check for wildcards
            if(to === '*')
            {
                throw new Error('Transitioning to a wildcard doesn\'t make sense');
            }

            // add transition
            this.map.set(from + '.' + action, to);
            return update(this);
        },

        /**
         * Removes an existing state
         *
         * @param   {string}    state
         * @returns {TransitionMap}
         */
        remove: function (state)
        {
            // remove "from" state
            this.map.remove(state);

            // remove "to" states
            let data = this.map.data;
            for(let name in data)
            {
                let from = data[name];
                for(let action in from)
                {
                    if(from[action] === state)
                    {
                        delete from[action];
                    }
                }
            }

            // update and return
            return update(this);
        },


    // ------------------------------------------------------------------------------------------------
    // accessors

        /**
         * Get all available actions (or action => states map) for a given state
         *
         * @param   {string}    from        Name of a state to get actions for
         * @param   {boolean}   [asMap]     Optional boolean to return a Object of action:state properties. Defaults to false
         * @returns {string[]|Object}       An array of string actions, or a hash of action:states
         */
        getActionsFrom: function (from, asMap = false)
        {
            if(this.has(from) || this.has('*'))
            {
                // get all available actions
                let actions     = this.map.get(from) || {};
                let wildcard    = this.map.get('*');
                let output      = Object.assign({}, actions);

                // append wildcard actions
                if(wildcard)
                {
                    for(var action in wildcard)
                    {
                        let value = wildcard[action];
                        if(value !== from && !actions[action])
                        {
                            output[action] = value;
                        }
                    }
                }

                // return map or keys
                return output
                    ? asMap
                        ? output
                        : Object.keys(output)
                    : [];
            }
            return [];
        },

        /**
         * Get the first available action to move from one state to another (if there is one)
         *
         * @param   {string}    from
         * @param   {string}    to
         * @return  {string|null}
         */
        getActionFor: function (from, to)
        {
            let actions = this.map.get(from);
            for(let action in actions)
            {
                if(actions[action] === to)
                {
                    return action;
                }
            }
            return null;
        },

        /**
         * Get all available "to" states for a given state
         *
         * Loops over all actions and returns a unique array of "to" states
         *
         * @param   {string|null}    [from]     Optional name of a from state to get states for. Defaults to the current state
         * @returns {string[]}                  An array of string states
         */
        getStatesFrom: function (from)
        {
            if(this.hasState(from))
            {
                let actions = this.getActionsFrom(from, true);
                return Object.keys(actions).map( name => actions[name] );
            }
            return null;
        },

        /**
         * Get the target "to" state from a "from" state via an "action"
         *
         * @param   {string}    from
         * @param   {string}    action
         * @returns {string}
         */
        getStateFor: function (from, action)
        {
            let states = this.getActionsFrom(from, true) || {};
            return states[action];
        },

        /**
         * Get all states within the system
         *
         * @return  {string[]}
         */
        getStates: function ()
        {
            return [].concat(this.states);
        },

        /**
         * Get all actions within the system
         *
         * @return  {string[]}
         */
        getActions: function ()
        {
            return [].concat(this.actions);
        },

        /**
         * General getter
         *
         * @param   {string}    path
         * @return  {*}
         */
        get: function(...path)
        {
            path = [...path].join('.');
            return this.map.get(path);
        },


    // ------------------------------------------------------------------------------------------------
    // checks

        /**
         * Test if the given state exists within the system
         *
         * @param   {string}    state
         * @returns {boolean}
         */
        hasState: function (state)
        {
            return this.states.indexOf(state) !== -1;
        },

        /**
         * Test if the given action exists within the system
         *
         * @param   {string}    action
         * @returns {boolean}
         */
        hasAction: function (action)
        {
            return this.actions.indexOf(action) !== -1;
        },

        /**
         * Test if the given transition exists within the system
         *
         * @param   {string}    action
         * @param   {string}    from
         * @param   {string}    to
         * @returns {boolean}
         */
        hasTransition: function (action, from, to)
        {
            return this.map.get(from + '.' + action) === to;
        },

        /**
         * Utility function to directly check if the composed ValueMap has the requested path
         *
         * Note this does NOT take into account the value of the target object; use hasTransition() for that
         *
         * @param   {string}    path    Pass a path using dot notation, i.e. 'a.next' or pass individual arguments, i.e. from, action, to
         * @returns {boolean}
         */
        has: function (...path)
        {
            path = [...path].join('.');
            return !! path
                ? this.map.has(path)
                : false;
        }

};

TransitionMap.prototype.constructor = TransitionMap;

/**
 * Private utility function to update existing states and actions
 *
 * @param   {TransitionMap} target
 * @returns {TransitionMap}
 */
function update(target)
{
    // variables
    var actions     = {};
    var states      = {};
    var data        = target.map.data;
    var to;

    // collate from states
    for(let from in data)
    {
        states[from] = true;
        for(let action in data[from])
        {
            actions[action] = true;
            to = data[from][action];
            if(typeof to !== 'function')
            {
                states[to] = true;
            }
        }
    }

    // update
    target.states  = Object.keys(states).filter(state => state !== '*');
    target.actions = Object.keys(actions);

    // return
    return target;
}

export default TransitionMap;
