import {isObject, isArray, isDefined, isUndefined} from '../utils/utils';

/**
 * Utility class to create, modify and delete nested hashes and values
 *
 * @constructor
 */
export default function ValueMap (data)
{
    this.data = data || {};
}

ValueMap.prototype =
{
    data: null,

    set: function (path, value)
    {
        set(this.data, path, value);
        return this;
    },

    add:function(path, value)
    {
        add(this.data, path, value);
        return this;
    },

    insert:function(path, value)
    {
        insert(this.data, path, value);
        return this;
    },

    get:function(path)
    {
        return get(this.data, path);
    },

    has: function (path, value = undefined)
    {
        return has(this.data, path, value)
    },

    indexOf: function (path, value)
    {
        return indexOf(this.data, path, value)
    },

    remove: function (path, value = undefined)
    {
        remove(this.data, path, value);
        return this;
    },

    keys:function(path)
    {
        return Object.keys(get(this.data, path));
    },

    values:function(path)
    {
        return values(this.data, path);
    }

};

function create(obj, keys)
{
    let key;
    while(keys.length)
    {
        key = keys.shift();
        if( ! isObject(obj[key]) )
        {
            obj[key] = {};
        }
        obj = obj[key];
    }
    return obj;
}

export function set(obj, path, value, index = -1)
{
    let keys = String(path).split('.'),
        key  = keys.pop();
    obj = create(obj, keys);
    obj[key] = value;
}

function add(obj, path, value)
{
    let keys = String(path).split('.'),
        key  = keys.pop();
    obj = create(obj, keys);
    if( ! isArray(obj[key]) )
    {
        obj[key] = [];
    }
    obj[key].push(value);
}

function insert(obj, path, value)
{
    let keys = String(path).split('.'),
        key  = keys.pop();
    obj = create(obj, keys);
    if( ! isArray(obj[key]) )
    {
        obj[key] = [];
    }
    let parent = obj[key],
        index = parent.indexOf(value);
    if(index === -1)
    {
        parent.push(value);
    }
    else
    {
        parent[index] = value;
    }
}

export function get(obj, path)
{
    if(isUndefined(path) || path == '')
    {
        return obj;
    }

    let key,
        keys = String(path).split('.');
    while(keys.length > 1)
    {
        key = keys.shift();
        if( ! obj.hasOwnProperty(key) )
        {
            return;
        }
        obj = obj[key];
    }
    key = keys.shift();
    return obj[key];
}

export function has(obj, path, value)
{
    let parent = get(obj, path);
    return !! (isArray(parent) && isDefined(value)
        ? parent.indexOf(value) !== -1
        : isUndefined(value)
            ? isDefined(parent)
            : parent === value);
}

export function indexOf (obj, path, value)
{
    let arr = get(obj, path);
    if(isArray(arr))
    {
        return arr.indexOf(value);
    }
    return -1;
}

export function remove(obj, path, value)
{
    let parent = obj,
        keys = String(path || '').split('.'),
        key = keys.pop();

    if(keys.length)
    {
        parent = get(obj, keys.join('.'))
    }
    if(isDefined(value) && isArray(parent[key]))
    {
        let target = parent[key];
        var index = target.indexOf(value);
        if(index > -1)
        {
            target.splice(index, 1);
            if(target.length === 0)
            {
                delete parent[key];
            }
            return true;
        }
        return false;
    }
    else
    {
        if(isObject(parent) && obj.hasOwnProperty(key))
        {
            delete parent[key];
            return true;
        }
    }
    return false
}

export function values(obj, path)
{
    var values = [];
    var target = get(obj, path);
    if(isObject(target))
    {
        for(var name in target)
        {
            if(target.hasOwnProperty(name))
            {
                values.push(target[name]);
            }
        }
    }
    return values;
}
