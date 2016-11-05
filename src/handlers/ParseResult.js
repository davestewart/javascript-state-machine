import ParseError from './ParseError';

export default function ParseResult (id)
{
    this.id = id;
    this.targets = ['*'];
}

ParseResult.prototype =
{
    id          : '',
    namespace   : '',
    type        : '',
    targets     : [],
    paths       : [],

    setNamespace:function(value)
    {
        if(this.namespace && value !== this.namespace)
        {
            throw new ParseError('Cannot set namespace "' +value+ '" for existing result ' +this.toString());
        }
        this.namespace = value;
        return this;
    },

    setType:function(value)
    {
        if(this.type && value !== this.type)
        {
            throw new ParseError('Cannot set type "' +value+ '" for existing result ' +this.toString());
        }
        this.type = value;
        return this;
    },

    setTarget:function(value)
    {
        this.targets = Array.isArray(value) ? value : [value];
        return this;
    },

    update:function()
    {
        this.paths = this.targets.map( target =>
        {
            var segments = this.namespace === 'action' || this.namespace === 'state'
                ? [this.namespace, target, this.type]
                : [this.namespace, this.type];
            return segments.join('.');
        });
        return this;
    },

    toString:function()
    {
        var parts = this.namespace && this.type
            ? [this.namespace, this.type]
            : this.namespace
                ? [this.namespace]
                : [this.type];
        return '[' + parts.join(':') + ']';
    }

};

