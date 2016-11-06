export function ParseError(message)
{
    this.name = 'ParseError';
    this.message = message;
}

ParseError.prototype = Error.prototype;
