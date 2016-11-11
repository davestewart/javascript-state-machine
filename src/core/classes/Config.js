export default function Config (options)
{
    'initial final start debug errors scope transitions'
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

        // allow user to specify a custom initialize event name
        initialize  :'initialize',

        // allow user to specify alternate triggers for event and action ids
        action      :'start',
        state       :'enter'

    }, options.defaults);
}

Config.prototype =
{
    /** @var string */
    initial     : '',

    /** @var string */
    final       : '',

    /** @var boolean */
    start       : true,

    /** @var boolean */
    debug       : false,

    /**
     * A number indicating how to handle errors
     *
     *  - 0 : ignore
     *  - 1 : console.warn()
     *  - 2 : throw an error
     *
     * @var number
     */
    errors      : 0,

    /** @var object */
    scope       : null,

    /** @var *[] */
    transitions : null,

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

};
