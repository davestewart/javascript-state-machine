export function ParseError(message, path, id)
{
    this.message = message;
    this.path = path;
    this.id = id;
}

ParseError.prototype = Error.prototype;
ParseError.prototype.name = 'ParseError';
ParseError.prototype.constructor = ParseError;