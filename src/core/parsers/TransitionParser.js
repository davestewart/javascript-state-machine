import { isString } from '../utils/utils';
import { ParseError } from '../objects/errors';
import TransitionMeta from './TransitionMeta';

// ------------------------------------------------------------------------------------------------
// functions

    function getError(tx, message)
    {
        return 'Invalid transition shorthand pattern "' +tx+ '" - ' + message;
    }

    function add(transitions, action, from, to)
    {
        transitions.push(new TransitionMeta(action, from, to));
    }


// ------------------------------------------------------------------------------------------------
// export

    /**
     * Parses/expands transition objects/strings into discrete transitions
     *
     * @returns {TransitionMeta[]}  An array of TransitionMeta instances
     */
    export default function parse (tx)
    {
        if(isString(tx))
        {
            // pre-process string
            tx = tx
                .replace(/([|=:<>])/g, ' $1 ')
                .replace(/\s+/g, ' ')
                .replace(/^\s+|\s+$/g,'');

            // ensure string is valid
            if(!/^\w+ [:|=] [*\w][\w ]*[<>] [*\w][\w ]*/.test(tx))
            {
                throw new ParseError(getError(tx, 'cannot determine action and states'));
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
                        throw new ParseError(getError(tx, 'transitioning between 2 arrays doesn\'t make sense'));
                    }
                    if(b === '*')
                    {
                        throw new ParseError(getError(tx, 'transitioning to a wildcard doesn\'t make sense'));
                    }
                    if(Array.isArray(a))
                    {
                        a.forEach( a => add(transitions, action, a, b) );
                    }
                    else if(Array.isArray(b))
                    {
                        b.forEach( b => add(transitions, action, a, b) );
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
    }
