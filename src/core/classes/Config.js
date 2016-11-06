export default function Config (options)
{
    'initial final start debug scope transitions'
        .match(/\w+/g)
        .map( name =>
        {
            if(options.hasOwnProperty(name))
            {
                this[name] = options[name];
            }
        });

    // order
    this.order      = options.order || this.getDefaultOrder();

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
