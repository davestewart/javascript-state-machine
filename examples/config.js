export default {

    initial : null,

    final   : 'final',

    debug   : ! true,

    start   : true,

    events: [
        {name: 'warn', from: 'green', to: 'yellow'},
        {name: 'panic', from: 'green', to: 'red'},
        {name: 'clear', from: 'yellow', to: 'green'},
        {name: 'panic', from: 'yellow', to: 'red'},
        {name: 'clear', from: 'red', to: 'green'},
        {name: 'calm', from: 'red', to: 'yellow'},
        {name: 'random', from: 'red', to: function(states, ...rest)
        {
            console.info('RANDOM:', states, rest);
            return states[0];
        }},
        {name: 'finish', from: 'red', to: 'final'}
    ],

    handlers: {
        'enter green': function (event) {
            console.log('enter green', event)
        },
        'leave green': function (event) {
            console.log('leave green', event)
            event.pause()
        },
        'leave yellow': function (event) {
            console.log('leave yellow', event)
        },
        'leave red': function (event) {
            console.log('leave red', event)
        },
        'leave purple': function (event) {
            console.log('leave purple', event)
        },
        'leave *': function validate(event) {
            console.log('leave *', event)
        },
        'leave': function submit(event) {
            console.log('leave', event)
        },
        'leave green yellow red': function (event) {
            console.log('leave green yellow red', event)
        },
        'start next': function (event) {
            console.log('start next', event)
        },
        'end finish': function (event) {
            console.log('end final', event)
        },
        'start warn': function (event) {
            console.log('start warn', this.title, event)
        },
        'end *': function (event) {
            console.log('end *', event)
        },
    },

    other: [
        'warn   : green     > yellow',
        'panic  : green     > red',
        'clear  : yellow    > green',
        'panic  : yellow    > red',
        'clear  : red       > green',
        'calm   : red       > yellow',
        'finish : red       > end',

        'finish : *         > end',
        'finish : green red > end',

        {name: 'foo', from: '*', to: 'red'},
        {name: 'foo', from: 'green yellow', to: 'red'},
        {name: 'bar', from: ['green', 'yellow'], to: 'red'},
        {name: 'baz', from: 'green', to: ['yello', 'red']},

    ]

}