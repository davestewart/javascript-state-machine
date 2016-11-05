import mocha from 'mocha';
import chai from 'chai';
import StateMachine from '../src/StateMachine';

//const describe = mocha.describe;
//const it = mocha.it;

chai.expect();

const assert = chai.assert;
const expect = chai.expect;

// make a new state machine
let fsm = new StateMachine({
    start: 'a',
    final: 'c',
    transitions: [
        {name: 'initialize', from: 'none', to: 'a'},

        {name: 'next', from: 'a', to: 'b'},
        {name: 'next', from: 'b', to: 'c'},
        {name: 'next', from: 'c', to: 'a'},

        {name: 'back', from: 'c', to: 'b'},
        {name: 'back', from: 'b', to: 'a'},
        {name: 'back', from: 'a', to: 'c'}
    ]
});

function test (id, input)
{
    let expected    = input.match(/\S+/g);
    let paths       = fsm.handlers.parse(id).paths;
    assert.deepEqual(expected, paths);
}

describe('Testing parsing of event handler ids for:', function () {

    describe('system (shorthand)', function () {

        describe('start', function () {
            it("results in 'system.start'", function () {
                test('start', 'system.start');
            });
        });

        describe('change', function () {
            it("results in 'system.change'", function () {
                test('change', 'system.change');
            });
        });

        describe('update', function () {
            it("results in 'system.update'", function () {
                test('update', 'system.update');
            });
        });

        describe('complete', function () {
            it("results in 'system.complete'", function () {
                test('complete', 'system.complete');
            });
        });

        describe('reset', function () {
            it("results in 'system.reset'", function () {
                test('reset', 'system.reset');
            });
        });

        describe('add', function () {
            it("results in 'system.add'", function () {
                test('add', 'system.add');
            });
        });

        describe('remove', function () {
            it("results in 'system.remove'", function () {
                test('remove', 'system.remove');
            });
        });

    });

    describe('transition (shorthand)', function () {

        describe('pause', function () {
            it("results in 'transition.pause'", function () {
                test('pause', 'transition.pause');
            });
        });

        describe('resume', function () {
            it("results in 'transition.resume'", function () {
                test('resume', 'transition.resume');
            });
        });

        describe('cancel', function () {
            it("results in 'transition.cancel'", function () {
                test('cancel', 'transition.cancel');
            });
        });

    });


    describe('system / transition (absolute)', function () {

        describe('system.start', function () {
            it("results in 'system.start'", function () {
                test('system.start', 'system.start');
            });
        });

        describe('transition.pause', function () {
            it("results in 'transition.pause'", function () {
                test('transition.pause', 'transition.pause');
            });
        });

    });

    describe('action', function () {

        describe('action', function () {
            it("results in 'action.*.start'", function () {
                test('action', 'action.*.start');
            });
        });

        describe('next', function () {
            it("results in 'action.next.start'", function () {
                test('next', 'action.next.start');
            });
        });

        describe('(next|back)', function () {
            it("results in 'action.next.start action.back.start'", function () {
                test('(next|back)', 'action.next.start action.back.start');
            });
        });

        describe(':start', function () {
            it("results in 'action.*.start'", function () {
                test(':start', 'action.*.start');
            });
        });

        describe(':end', function () {
            it("results in 'action.*.end'", function () {
                test(':end', 'action.*.end');
            });
        });

        describe('next:start', function () {
            it("results in 'action.next.start'", function () {
                test('next:start', 'action.next.start');
            });
        });

        describe('next:end', function () {
            it("results in 'action.next.end'", function () {
                test('next:end', 'action.next.end');
            });
        });

        describe('action.next:end', function () {
            it("results in 'action.next.end'", function () {
                test('action.next:end', 'action.next.end');
            });
        });

        describe('(next|back):end', function () {
            it("results in 'action.next.end action.back.end'", function () {
                test('(next|back):end', 'action.next.end action.back.end');
            });
        });

    });

    describe('state', function () {

        describe('state', function () {
            it("results in 'state.*.enter'", function () {
                test('state', 'state.*.enter');
            });
        });

        describe('a', function () {
            it("results in 'state.a.enter'", function () {
                test('a', 'state.a.enter');
            });
        });

        describe(':enter', function () {
            it("results in 'state.*.enter'", function () {
                test(':enter', 'state.*.enter');
            });
        });

        describe(':leave', function () {
            it("results in 'state.*.leave'", function () {
                test(':leave', 'state.*.leave');
            });
        });

        describe('a:leave', function () {
            it("results in 'state.a.leave'", function () {
                test('a:leave', 'state.a.leave');
            });
        });

        describe('(b|c):enter', function () {
            it("results in 'state.*.leave'", function () {
                test('(b|c):enter', 'state.b.enter state.c.enter');
            });
        });

    });

    describe('state + action', function () {

        describe('a.next', function () {
            it("results in 'state.a.next'", function () {
                test('a.next', 'state.a.next');
            });
        });

        describe('b:leave', function () {
            it("results in 'state.b.leave'", function () {
                test('b:leave', 'state.b.leave');
            });
        });

        describe('(a|b).next', function () {
            it("results in 'state.a.next state.b.next'", function () {
                test('(a|b).next', 'state.a.next state.b.next');
            });
        });

        describe('state.(a|b).next', function () {
            it("results in 'state.a.next state.b.next'", function () {
                test('state.(a|b).next', 'state.a.next state.b.next');
            });
        });

        describe('@next', function () {
            it("results in 'action.next.start'", function () {
                test('@next', 'action.next.start');
            });
        });

        describe('a@next', function () {
            it("results in 'state.a.next'", function () {
                test('a@next', 'state.a.next');
            });
        });

        describe('(a|b)@next', function () {
            it("results in 'state.a.next state.b.next '", function () {
                test('(a|b)@next', 'state.a.next state.b.next');
            });
        });

    });

});
