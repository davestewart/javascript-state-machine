import HandlerMeta from './HandlerMeta';
import Lexer from '../lexer/Lexer'


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

    function isAction(token)
    {
        if(fsm.transitions.hasAction(token))
        {
            return true;
        }
        //throw new ParseError('Unrecognised action "' + token + '"');
    }

    function isState(token)
    {
        if(fsm.transitions.hasState(token))
        {
            return true;
        }
        //throw new ParseError('Unrecognised state "' + token + '"');
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


// ------------------------------------------------------------------------------------------------
// export

    /**
     * Parses event handler id into a HandlerMeta result containing handler paths
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

    var patterns  =
    {
        // start pause intro
        alias               : /^(\w+)$/,

        // system.start state.add
        namespaced          : /^(system|transition|state|action)\.(\w+)$/,

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

    let fsm,
        defaults,
        result;

    var parser =
    {
        /**
         * Parses event handler id into HandlerMeta instance
         *
         * Resolving namespace, type and target properties
         *
         * @param   {string}        id
         * @param   {StateMachine}  _fsm
         * @return  {HandlerMeta}
         */
        parse (id, _fsm)
        {
            // objects
            fsm         = _fsm;
            defaults    = _fsm.config.defaults;
            result      = new HandlerMeta(id);

            // expand groups
            let paths   = expandGroups(id);

            // process paths
            paths.map( id => this.parsePath(id, fsm) );

            // return
            return result;
        },

        parsePath:function(path, fsm)
        {
            let tokens;
            try
            {
                tokens = lexer.process(path)
            }
            catch(error)
            {
                result.paths.push('[invalid].' + error.message);
                return;
            }

            if(tokens && tokens.length)
            {
                // variables
                let token   = tokens.shift();
                var fn      = this[token.type];
                result.setType(token.type);

                // process
                if(fn)
                {
                    let path = fn.apply(this, token.values);
                    result.paths.push(path || '[invalid].' + token.match);
                    return path;
                }
                throw new Error('Unknown token type "' +token.type+ '"');
            }
        },

        alias (value)
        {
            if (isSystem(value)) return 'system.' + value;
            if (isTransition(value)) return 'transition.' + value;
            return this.oneState(value);
        },

        namespaced (namespace, type)
        {
            if(namespace === 'system' && isSystem(type) || namespace === 'transition' && isTransition(type)) return namespace + '.' + type;
            if(/^(state|action)$/.test(namespace) && /^(add|remove)$/.test(type)) return 'system.' + namespace + '.' + type;
        },

        oneState (state)
        {
            if (isState(state, fsm))
            {
                result.targets.push(state);
                return 'state.' + state + '.' + defaults.state;
            }
        },

        oneAction (action)
        {
            if(isAction(action))
            {
                result.targets.push(action);
                return 'action.' +action+ '.' +defaults.action;
            }
        },

        anyActionEvent (event)
        {
            result.targets.push('*');
            return 'action.*.' + event;
        },

        oneActionEvent (action, event)
        {
            if(isAction(action))
            {
                result.targets.push(action);
                return 'action.' +action+ '.' + event;
            }
        },

        anyStateEvent (event)
        {
            result.targets.push('*');
            return 'state.*.' + event;
        },

        oneStateEvent (state, event)
        {
            if(isState(state))
            {
                result.targets.push(state);
                return 'state.' +state+ '.' + event;
            }
        },

        oneStateAction (state, action)
        {
            if(isState(state) && isAction(action))
            {
                result.targets.push(state);
                return 'state.' +state+ '.' + action;
            }
        }

    };
