import StateMachine from '../../StateMachine';

export default function Config (options)
{
    'scope start initial final invalid errors'
        .match(/\w+/g)
        .map( name =>
        {
            if(options.hasOwnProperty(name))
            {
                this[name] = options[name];
            }
        });

    // order
    this.order      = options.order || StateMachine.getDefaultOrder();

    // defaults
    this.defaults   = Object.assign({

        // allow user to specify alternate triggers for event and action ids
        action      :'start',
        state       :'enter'

    }, options.defaults);
}

Config.prototype =
{
    /**
     * An optional scope to run handler functions in
     *
     * @var object
     */
    scope       : null,

    /**
     * A boolean to automatically start the state machine in the initial state
     *
     * @var boolean
     */
    start       : true,

    /**
     * A string to indicate which state to start on; defaults to ''
     *
     * @var string
     */
    initial     : '',

    /**
     * A string indicating the state to trigger a complete event; defaults to ''
     *
     * @var string
     */
    final       : '',

    /**
     * A boolean to allow non-existent states and actions to be added to the handlers object; defaults to false (disallow)
     *
     * @var boolean
     */
    invalid     : false,

    /**
     * A number indicating how to handle invalid or erroneous actions; defaults to 1 (warn)
     *
     *  - 0 : quiet
     *  - 1 : console.warn()
     *  - 2 : throw an error
     *
     * @var number
     */
    errors      : 1,

    /**
     * The order to run transition callbacks in
     *
     * @type {string[]} type.target
     */
    order       : null,

    /**
     * Sets defaults for various declarations
     *
     * Available options are:
     *
     * - action: (start|end)
     * - state: (enter|leave)
     *
     * @type {Object}
     */
    defaults    : null,

};
