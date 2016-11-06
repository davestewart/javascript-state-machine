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

    process:function(source)
    {
        this.source = source;
        this.tokens = [];
        this.index  = 0;
        this.next();
        return this.tokens;
    },

    addRule:function(name, rx)
    {
        this.rules.push(new Rule(name, new RegExp('^' + rx.source)));
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
                    this.tokens.push(new Token(rule.name, matches[1]));
                    this.index += matches[0].length;
                    return true;
                }
                return false;
            });

            // not matched
            if(!state)
            {
                throw new Error('Unable to match source at position ' + this.index + ': "' +source+'"');
            }

            // match
            this.next();
        }
    }
};

function Token(name, value)
{
    this.name = name;
    this.value = value;
}

function Rule(name, rx)
{
    this.name = name;
    this.rx = rx;
}

