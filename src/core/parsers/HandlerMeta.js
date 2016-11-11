function HandlerMeta (id, path, namespace = '', target = '')
{
    this.id         = id;
    this.path       = path;
    if(namespace)
    {
        this.namespace  = namespace;
    }
    if(target)
    {
        this.target     = target;
    }
}

HandlerMeta.prototype =
{
    id          : '',
    path        : '',
    namespace   : '',
    target      : ''
};

export default HandlerMeta;
