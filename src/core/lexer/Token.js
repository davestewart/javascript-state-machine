/**
 * Token class, representing the type and value of part of a source string
 *
 * @param       {string}    type
 * @param       {string[]}  matches
 *
 * @property    {string}    type
 * @property    {string}    match
 * @property    {string[]}  values
 */
function Token(type, matches)
{
    this.type       = type;
    this.match      = matches[0];
    this.values     = matches.slice(1);
}

export default Token;
