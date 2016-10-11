import chai from 'chai';
import ValueMap from '../src/utils/ValueMap';

chai.expect();

const expect = chai.expect;

var map;

describe('Given an instance of my library', function () {

    before(function () {
        map = new ValueMap({
            val:1,
            obj:{},
            arr:[]
        });
    });

    describe('when I set a property it', function () {
        it('should return the name', () => {
            expect(fsm.state).to.be.equal('');
        });
    });

    describe('when I need the blah', function () {
        it('should return the name', () => {
            expect(fsm.state).to.be.equal('');
        });
    });


});