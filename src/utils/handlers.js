let lookup =
{
    namespaces:
    {
        start   :'system',
        change  :'system',
        update  :'system',
        complete:'system',
        reset   :'system',
        add     :'system',
        remove  :'system',

        pause   :'transition',
        resume  :'transition',
        cancel  :'transition'
    },

    events:
    {
        start   :'action',
        end     :'action',
        enter   :'state',
        leave   :'state'
    }
};

/**
 * Parses an event handler id into namespace, type, and target variables
 *
 * @param {StateMachine}    fsm
 * @param {string}          id
 * @return {*[]}
 */
export function parse(fsm, id)
{
    // variables
    let defaults = fsm.config.defaults,
        segments,
        namespace,
        type,
        targets;

    // utility functions
    function isState(value) {
        return fsm.states.indexOf(value) !== -1;
    }

    function isAction(value) {
        return fsm.actions.has(value);
    }

    function getTargets(value) {
        return value ? value.match(/\w[-\w]*/g) : ['*'];
    }

    function determineValue(value) {

        // is namespace, i.e. system, transition, state, action
        if(/^(system|transition|state|action)$/.test(value))
        {
            namespace = value;
        }

        // is shortcut, i.e. update, change, pause, cancel
        else if(value in lookup.namespaces)
        {
            namespace = lookup.namespaces[value];
            type = value;
        }

        // is state or action, i.e. a, next
        else if (isState(value) || isAction(value))
        {
            if(!namespace)
            {
                namespace = isState(value)
                    ? 'state'
                    : 'action';
            }

            // special case for state with action
            if(namespace === 'state' && isAction(value))
            {
                type = value;
            }

            if(!targets)
            {
                targets = getTargets(value);
            }
        }

        // action / leave
        else if(/^(enter|leave)$/.test(value))
        {
            type = value;
        }
    }

    // process
    segments    = id.match(/:\w+|@\w+|\(.+?\)|\.\w+|\w+/g);

    // process segments
    segments.forEach(function (segment, i, segments)
    {
        // variables
        let char    = segment[0];
        let values  = segment.match(/\w+/g);
        let value   = values[0];
        switch(char)
        {
            // event
            case ':':
                namespace   = lookup.events[value];
                type        = value;
                break;

            // action
            case '@':
                namespace   = 'state';
                type        = value;
                break;

            // targets
            case '(':
                targets = values;
                namespace = isState(values[0]) ? 'state' : 'action';
                break;

            // property
            case '.':
                determineValue(value);
                break;

            // single word
            default:
                determineValue(segment);
        }
    });

    // final processing
    if(!targets)
    {
        targets = getTargets();
    }

    if(!namespace)
    {
        namespace = isState(targets[0]) ? 'state' : 'action';
    }

    if(!type)
    {
        type = defaults[namespace];
    }

    // return values
    return [namespace, type, targets];
}

/**
 * Builds the path to a handler
 *
 * System and Transition only have 2 segments, Action and State have 3
 *
 * @param {string}      namespace
 * @param {string}      type
 * @param {string}      target
 * @return {string}
 */
export function getPath(namespace, type, target)
{
    return namespace === 'action' || namespace === 'state'
        ? [namespace, target, type].join('.')
        : namespace + '.' + type;
}
