export function isObject (value)
{
    return Object.prototype.toString.call(value) === '[object Object]';
}

export function isArray (value)
{
    return value instanceof Array;
}

export function isString (value)
{
    return typeof value === 'string';
}

export function isFunction(value)
{
    return value instanceof Function;
}

export function isDefined (value)
{
    return typeof value !== 'undefined';
}

export function isUndefined (value)
{
    return typeof value === 'undefined';
}

export function trim (value)
{
    return String(value || '').replace(/^\s+|\s+$/g, '');
}