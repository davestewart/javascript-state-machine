import chai from 'chai';
import StateMachine from '../src/StateMachine';

chai.expect();

const expect = chai.expect;

var fsm;

describe('Given an instance of my library', function () {

  before(function () {
    fsm = new StateMachine();
  });

  describe('when I need the name', function () {
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