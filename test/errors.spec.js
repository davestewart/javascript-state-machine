import { expect } from 'chai';
import StateMachine from '../src/StateMachine';
import { ParseError } from '../src/core/objects/errors';

var fsm;

describe('Errors', function () {

  before(function () {
    fsm = new StateMachine();
  });

  describe('when constructing an error', function () {
    it('should have the correct name', () => {
      expect(new Error().name).to.equal('Error');
    });
  });

  describe('when constructing a custom error', function () {
    it('should have the custom name', () => {
      expect(new ParseError().name).to.equal('ParseError');
    });
  });

});
