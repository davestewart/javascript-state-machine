/**
 * A parsing rule, designed to match part of a string
 *
 * @param   {string}    name
 * @param   {RegExp}    rx
 */
function Rule(name, rx)
{
    this.name = name;
    this.rx = rx;
}

export default Rule;
