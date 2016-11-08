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
     * @param   {string}    id      A valid event handler id signature
     * @returns {HandlerMeta}
     */
    parse: function (id)
    {
        return parseHandler(id, this.fsm);
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
     * @param   {string}    namespace
     * @param   {string}    type
     * @param   {string}    key
     * @param   {*}         value
     * @returns {StateMachine}
     */
    update: function (namespace, type, key = '', value = null)
    {
        // create lookup path
        let path = namespace + '.' + type;

        //debug
        this.fsm.config.debug && console.info('StateMachine: dispatch "%s"', path);

        // build event
        let event = namespace === 'system'
            ? new SystemEvent(type, key, value)
            : new TransitionEvent(type);

        // dispatch
        let handlers = this.map.get(path);
        if(handlers)
        {
            handlers.map(fn => fn(event, this) );
        }
    }

};

export default HandlerMap;
