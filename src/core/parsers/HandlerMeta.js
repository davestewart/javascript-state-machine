function HandlerMeta (id)
{
    this.id = id;
    this.type = '';
    this.paths = [];
    this.targets = [];
}

HandlerMeta.prototype =
{
    id          : '',
    type        : '',
    paths       : [],
    targets     : [],

    setType (value)
    {
        if(!this.type)
        {
            this.type = value;
        }
    }
};

export default HandlerMeta;
