import HandlerMeta from './HandlerMeta';
import Lexer from '../lexer/Lexer'
import { trim } from '../utils/utils';
import { ParseError } from '../objects/errors';


// ------------------------------------------------------------------------------------------------
// functions

    function isSystem(token)
    {
        return /^(start|change|complete|reset)$/.test(token);
    }

    function isTransition(token)
    {
        return /^(pause|resume|cancel)$/.test(token);
    }

    function expandGroups (input)
    {
        var rx 		= /\((.+?)\)/;
        var matches = input.match(rx);
        if(matches)
        {
            var group = matches[0];
            var items = matches[1].match(/\S+/g);
            if(items)
            {
                items = items.map(item => input.replace(group, item));
                if(rx.test(items[0]))
                {
                    return items.reduce( (output, input) => {
                        return output.concat(expandGroups(input));
                    }, []);
                }
                return items;
            }
        }
        return [input];
    }

    function addPath (path, namespace, target)
    {
        results.push(new HandlerMeta(_id, path, namespace, target));
        return true;
    }

    function addError (message, path)
    {
        var error = new ParseError(message, path, _id);
        results.push(error);
        return false;
    }


// ------------------------------------------------------------------------------------------------
// export

    /**
     * Parses event handler id into a HandlerMeta results containing handler paths
     *
     * @param   {string}    id          The handler id to parse, i.e. '@next', 'intro:end', 'change', etc
     * @param   {Object}    defaults     A StateMachine instance to test for states and actions
     * @return  {HandlerMeta[]}
     */
    export default function parse(id, defaults)
    {
        // pre-parse handler
        id          = trim(id);

        // objects
        _id         = id;
        _defaults   = defaults;
        results     = [];

        // parse
        parser.parse(id, defaults);

        // return
        return results;
    }


// ------------------------------------------------------------------------------------------------
// objects

    let results,
        _defaults,
        _id;

    var patterns  =
    {
        // start pause intro
        alias               : /^(\w+)$/,

        // system.start state.add
        namespaced          : /^(system|transition|state|action):(\w+)$/,

        // @next @quit
        oneAction           : /^@(\w+)$/,

        // @next:start @next:end
        oneActionEvent      : /^@(\w+):(start|end)$/,

        // :start :end
        anyActionEvent      : /^:(start|end)$/,

        // intro form
        oneState            : /^#(\w+)$/,

        // intro:enter intro:leave
        oneStateEvent       : /^#?(\w+):(leave|enter)$/,

        // :enter :leave
        anyStateEvent       : /^:(enter|leave)$/,

        // intro@next
        oneStateAction      : /^#?(\w+)@(\w+)$/
    };

    let lexer   = new Lexer(patterns);

    var parser =
    {
        /**
         * Parses event handler id into HandlerMeta instance
         *
         * Resolving namespace, type and target properties
         *
         * @param   {string}        id
         * @param   {Object}        defaults
         */
        parse (id, defaults)
        {
            // expand groups
            let paths   = expandGroups(id);

            // process paths
            paths.map( path => this.parsePath(path) );
        },

        parsePath:function(path)
        {
            let tokens;
            try
            {
                tokens = lexer.process(path)
            }
            catch(error)
            {
                return addError('Unrecognised pattern "' +path+ '"', path);
            }

            if(tokens && tokens.length)
            {
                // variables
                let token   = tokens.shift();
                var fn      = this[token.type];

                // process
                if(fn)
                {
                    return fn.apply(this, token.values);
                }
                return addError('Unknown token type "' +token.type+ '"', path);
            }
        },

        alias (value)
        {
            if (isSystem(value))
            {
                return addPath('system.' + value, 'system');
            }
            if (isTransition(value))
            {
                return addPath('transition.' + value, 'transition');
            }
            return this.oneState(value);
        },

        namespaced (namespace, type)
        {
            var path = namespace + '.' + type;

            if(namespace === 'system' && isSystem(type) || namespace === 'transition' && isTransition(type))
            {
                return addPath(path, namespace);
            }

            if(/^(state|action)$/.test(namespace) && /^(add|remove)$/.test(type))
            {
                return addPath('system.' + path, 'system');
            }

            addError('Unrecognised type "' +type+'" for namespace "' +namespace+ '"', _id)
        },

        oneState (state)
        {
            return addPath('state.' + state + '.' + _defaults.state, 'state', state);
        },

        oneAction (action)
        {
            return addPath('action.' +action+ '.' +_defaults.action, 'action', action);
        },

        anyActionEvent (event)
        {
            return addPath('action.*.' + event, 'action', '*');
        },

        oneActionEvent (action, event)
        {
            return addPath('action.' +action+ '.' + event, 'action', action);
        },

        anyStateEvent (event)
        {
            return addPath('state.*.' + event, 'state', '*');
        },

        oneStateEvent (state, event)
        {
            return addPath('state.' +state+ '.' + event, 'state', state);
        },

        oneStateAction (state, action)
        {
            return addPath('state.' +state+ '.' + action, 'state', state);
        }

    };
