import Rule from './Rule';
import Token from './Token';

/**
 * Simple Lexer class
 *
 * @param   {Object}    rules   A hash of id:RegExp values
 * @constructor
 */
export default function Lexer(rules)
{
    this.rules = [];
    if(rules)
    {
        Object.keys(rules).map( name => this.addRule(name, rules[name]) );
    }
}

Lexer.prototype =
{
    /** @var {String} */
    source  : null,

    /** @var {Rule[]} */
    rules   : null,

    /** @var {Token[]} */
    tokens  : null,

    /** @var {Number} */
    index   : 0,

    /**
     * Process a source string into an array of Tokens based on Rules
     *
     * @param source
     * @returns {Token[]}
     */
    process:function(source)
    {
        this.source = source;
        this.tokens = [];
        this.index  = 0;
        this.next();
        return this.tokens;
    },

    /**
     * Adds a new rule
     *
     * @protected
     * @param name
     * @param rx
     */
    addRule:function(name, rx)
    {
        this.rules.push(new Rule(name, rx));
    },

    next:function()
    {
        if(this.index < this.source.length)
        {
            let source  = this.source.substr(this.index);
            let state = this.rules.some(rule =>
            {
                var matches = source.match(rule.rx);
                if(matches)
                {
                    this.tokens.push(new Token(rule.name, matches));
                    this.index += matches[0].length;
                    return true;
                }
                return false;
            });

            // not matched
            if(!state)
            {
                throw new LexerError('Unable to match source at position ' + this.index + ': "' +source+'"', this.source, this.index);
            }

            // match
            this.next();
        }
    }
};

function LexerError(message, source, index)
{
    this.message = message;
    this.source = source;
    this.index = index;
}

LexerError.prototype = new Error;
LexerError.prototype.constructor = LexerError;
