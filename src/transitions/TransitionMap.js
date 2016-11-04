import ValueMap from '../utils/ValueMap';

export default function TransitionMap ()
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
         * Adds a new transition
         * 
         * @param   {string}    action
         * @param   {string}    from
         * @param   {string}    to
         * @returns {this}
         */
        add: function (action, from, to)
        {
            this.map.set(from + '.' + action, to);
            update(this);
            return this;
        },

        /**
         * 
         * @param state
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

            // update caches
            update(this);
        },


    // ------------------------------------------------------------------------------------------------
    // accessors

        /**
         * Get all available actions (or action => states map) for a given state
         *
         * @param   {string}    state       Name of a state to get actions for
         * @param   {boolean}   [asMap]     Optional boolean to return a Object of action:state properties. Defaults to false
         * @returns {string[]|Object}       An array of string actions, or a hash of action:states
         */
        getActionsFrom: function (state, asMap = false)
        {
            if(this.has(state))
            {
                let actions = this.map.get(state);
                return actions
                    ? asMap
                        ? actions
                        : Object.keys(actions)
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
        getActionTo: function (from, to)
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
         * @param   {string|null}    [state]    Optional name of a state to get states for. Defaults to the current state
         * @returns {string[]}                  An array of string states
         */
        getToStates: function (state)
        {
            if(this.hasState(state))
            {
                let actions = this.getActionsFrom(state, true);
                return Object.keys(actions).map( name => actions[name] );
            }
            return null;
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
        get:function(path)
        {
            path = Array.prototype.slice.apply(arguments).join('.');
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
         * Utility function to directly check if the composed ValueMap has the requested path
         *
         * @param   {string}    path    Pass a path using dot notation, i.e. 'a.next.b' or pass individual arguments, i.e. from, action, to
         * @returns {boolean}
         */
        has: function (path)
        {
            path = Array.prototype.slice.apply(arguments).join('.');
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
 */
function update(target)
{
    // variables
    var actions    = {};
    var states     = {};
    var data     = target.map.data;
    var to;

    // remove "to" states
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
    target.states  = Object.keys(states);
    target.actions = Object.keys(actions);
}
