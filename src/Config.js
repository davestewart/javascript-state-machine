import { isString } from './utils/utils';

export default function Config (options)
{
    'scope transitions initial final defer debug'
        .match(/\w+/g)
        .map( name =>
        {
            if(options.hasOwnProperty(name))
            {
                this[name] = options[name];
            }
        });

    this.order = options.order || this.getDefaultOrder();

    this.defaults = Object.assign({

        // allow user to specify a custom initialize event name
        initialize  :'initialize',

        // allow user to specify alternate triggers for event and action ids
        action      :'start',
        state       :'enter'

    }, options.defaults);

}

Config.prototype =
{
    // the scope to call all handlers in
    scope       : null,

    // states
    initial     : null,
    final       : null,
    transitions : null,

    // flags
    defer       : null,
    debug       : null,

    /**
     * The order to run transition callbacks in
     *
     * @type {string[]} type.target
     */
    order       : null,

    /**
     * Sets defaults for various declarations
     *
     * @type {Object}
     */
    defaults    : null,

    /**
     * Parses/expands transition objects/strings into discrete transitions
     *
     * @returns {Object[]}  An array of transition objects
     */
    parseTransition: function (tx)
    {
        if(isString(tx))
        {
            // pre-process string
            tx = tx
                .replace(/([|=:<>])/g, ' $1 ')
                .replace(/\s+/g, ' ')
                .replace(/^\s+|\s+$/g,'');

            // ensure string is valid
            if(!/^\w+ [:|=] \w[\w ]*[<>] \w[\w ]*/.test(tx))
            {
                throw newError(tx, 'cannot determine action and states');
            }

            // initialize variables
            let transitions = [],
                matches = tx.match(/([*\w ]+|[<>])/g),
                action  = matches.shift().replace(/\s+/g, ''),
                stack   = [],
                match   = '',
                op      = '',
                a       = '',
                b       = '';

            // process states
            while(matches.length)
            {
                // get the next match
                match = matches.shift();
                if(/[<>]/.test(match))
                {
                    op = match;
                }
                else
                {
                    match = match.match(/[*\w]+/g);
                    match = match.length === 1 ? match[0] : match;
                    stack.push(match);
                }

                // process matches if stack is full
                if(stack.length === 2)
                {
                    [a, b] = op === '<'
                        ? [stack[1], stack[0]]
                        : stack;
                    if(Array.isArray(a) && Array.isArray(b))
                    {
                        throw newError(tx, 'transitioning between 2 arrays doesn\'t make sense');
                    }
                    if(Array.isArray(a))
                    {
                        a.map( a => add(transitions, action, a, b) );
                    }
                    else if(Array.isArray(b))
                    {
                        b.map( b => add(transitions, action, a, b) );
                    }
                    else
                    {
                        add(transitions, action, a, b);
                    }

                    // discard original match once processed
                    stack.shift();
                }

            }

            // return
            return transitions;
        }

        // return objects wrapped in an array
        return [tx];
    },

    parseHandler: function ()
    {
        // move event handler parsing here at some point
    },

    getDefaultOrder: function ()
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
    }

};

function newError(tx, message)
{
    return new Error('Invalid transition shorthand pattern "' +tx+ '" - ' + message);
}

function add(transitions, name, from, to)
{
    transitions.push({name, from, to});
}

