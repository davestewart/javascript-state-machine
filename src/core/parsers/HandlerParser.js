import HandlerMeta from './HandlerMeta';
import { ParseError } from '../objects/errors';
import Lexer from '../utils/Lexer'


// ------------------------------------------------------------------------------------------------
// functions

    function isNamespace(token)
    {
        return /^(system|transition|action|state)$/.test(token);
    }

    function isSystem(token)
    {
        return /^(add|remove|start|change|update|complete|reset)$/.test(token);
    }

    function isTransition(token)
    {
        return /^(pause|resume|cancel)$/.test(token);
    }

    function isAction(token, fsm)
    {
        return fsm.transitions.hasAction(token);
    }

    function isState(token, fsm)
    {
        return fsm.transitions.hasState(token);
    }

    function getNamespace(token)
    {
        return isSystem(token)
            ? 'system'
            : isTransition(token)
                ? 'transition'
                : null;
    }

    function getEventNamespace(token)
    {
        return /^(enter|leave)$/.test(token)
            ? 'state'
            : /^(start|end)$/.test(token)
                ? 'action'
                : null;
    }


// ------------------------------------------------------------------------------------------------
// export

    /**
     * Parses event handler id into HandlerMeta instance
     *
     * @param   {string}        id      The handler id to parse, i.e. '@next', 'intro:end', 'change', etc
     * @param   {StateMachine}  fsm     A StateMachine instance to test for states and actions
     * @return  {HandlerMeta}
     */
    export default function parse(id, fsm)
    {
        return parser.parse(id, fsm);
    }


// ------------------------------------------------------------------------------------------------
// objects

    var lexer = new Lexer({
        targets  : /\.?\((.+?)\)/,
        property : /\.(\w+)/,
        action   : /@(\w+)/,
        event    : /:(\w+)/,
        word     : /(\w+)/
    });

    var parser =
    {
        result  :null,

        /**
         * Parses event handler id into HandlerMeta instance
         *
         * Resolving namespace, type and target properties
         *
         * @param   {string}        id
         * @param   {StateMachine}  fsm
         * @return  {HandlerMeta}
         */
        parse:function(id, fsm)
        {
            // variables
            let defaults    = fsm.config.defaults;
            let tokens      = lexer.process(id);
            let result      = this.result = new HandlerMeta(id);

            // process
            tokens.map( token => {
                this.parseToken(token.name, token.value, fsm);
            });

            if(!result.type)
            {
                result.setType(defaults[result.namespace]);
            }

            // return result
            return result.update();
        },

        /**
         * Parse token name and value
         *
         * @param   {string}        name
         * @param   {string}        value
         * @param   {StateMachine}  fsm
         */
        parseToken:function(name, value, fsm)
        {
            // variables
            let namespace,
                values;

            // process
            switch(name)
            {
                case 'targets':

                    values = value.match(/\w+/g);
                    namespace = isState(values[0], fsm)
                        ? 'state'
                        : isAction(values[0], fsm)
                            ? 'action'
                            : null;

                    if(namespace)
                    {
                        return this.result
                            .setNamespace(namespace)
                            .setTarget(values);
                    }

                    throw new ParseError('Unknown target(s) type "(' +value+ ')"');

                case 'action':

                    if(!isAction(value, fsm))
                    {
                        throw new ParseError('Unknown action "' +value+ '"');
                    }

                    if(!this.result.namespace)
                    {
                        this.result.setNamespace('action')
                    }
                    return this.result.namespace === 'state'
                        ? this.result.setType(value)
                        : this.result.setTarget(value);

                case 'event':

                    if((namespace = getEventNamespace(value)))
                    {
                        return this.result
                            .setNamespace(namespace)
                            .setType(value);
                    }
                    throw new ParseError('Unknown event "' +value+ '"');

                // any ".property"; could be system.change, intro.next
                case 'property':

                    return this.parseToken('word', value, fsm);

                default:

                    // top-level namespace, like system, transition, state
                    if(isNamespace(value))
                    {
                        return this.result
                            .setNamespace(value);
                    }

                    // generic value, like change, add, update
                    if((namespace = getNamespace(value)))
                    {
                        return this.result
                            .setNamespace(namespace)
                            .setType(value);
                    }

                    // existing state, like a, b, c
                    if (isState(value, fsm))
                    {
                        return this.result
                            .setNamespace('state')
                            .setTarget(value);
                    }

                    // existing action, like next, back, quit
                    if (isAction(value, fsm))
                    {
                        return this.parseToken('action', value, fsm);
                    }

                    // unknown
                    throw new ParseError('Unknown token "' +value+ '"');
            }
        }

    };
