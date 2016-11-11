import ValueMap from './ValueMap';
import { SystemEvent, TransitionEvent } from '../objects/events';
import { isFunction } from '../utils/utils';

import parseHandler from '../parsers/HandlerParser';

function HandlerMap (fsm)
{
    this.fsm    = fsm;
    this.map    = new ValueMap();
}

HandlerMap.prototype =
{

	fsm: null,

	map: null,

    /**
     * Parse event handler grammar into a HandlerMeta structure
     *
     * @param   {string}        id      The handler id to parse, i.e. '@next', 'intro:end', 'change', etc
     * @returns {HandlerMeta[]}
     */
    parse: function (id)
    {
        return parseHandler(id, this.fsm.config.defaults);
    },

    /**
     * Directly add a new handler
     *
     * @param   {string}    path    A 'namespace.target.type' target path to add a handler to
     * @param   {Function}  fn      A callback function
     * @returns {HandlerMap}
     */
    add: function (path, fn)
    {
        // check handler is a function
        if(!isFunction(fn))
        {
            throw new Error('Error assigning "' +path+ '" handler; callback is not a function', fn);
        }

        this.map.insert(path, fn);
        return this;
    },

    /**
     * Directly remove a handler target
     *
     * @param   {string}    path    A 'namespace.target.type' target to be removed
     * @returns {HandlerMap}
     */
    remove: function (path)
    {
        this.map.remove(path);
        return this;
    },

    /**
     * Get all handlers for a valid target path
     *
     * @param   {string}    path    A 'namespace.target.type' target path
     * @returns {Function[]}        An array of callback functions
     */
    get:function(path)
    {
        return this.map.get(path);
    },

    /**
     * Dispatch an event
     *
     * @param   {string}    path
     * @param   {*}         value
     * @returns {StateMachine}
     */
    trigger: function (path, value = null)
    {
        // create lookup path
        let [namespace, type] = path.match(/\w+/g);

        // build event
        let event = namespace === 'system'
            ? new SystemEvent(type, value)
            : new TransitionEvent(type);

        // dispatch
        let handlers = this.map.get(path);
        if(handlers)
        {
            handlers.map(fn => fn(event, this.fsm) );
        }
    }

};

export default HandlerMap;
