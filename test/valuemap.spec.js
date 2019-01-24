import { expect } from 'chai';
import StateMachine from '../src/StateMachine';
import ValueMap from '../src/core/maps/ValueMap';

var map, fsm;

describe('Given an instance of my library', function () {

    before(function () {
        fsm = new StateMachine();
        map = new ValueMap({
            val:1,
            obj:{},
            arr:[]
        });
    });

    describe('when I set a property it', function () {
        it('should return the name', () => {
            expect(fsm.state).to.equal('');
        });
    });

    describe('when I need the blah', function () {
        it('should return the name', () => {
            expect(fsm.state).to.equal('');
        });
    });


});