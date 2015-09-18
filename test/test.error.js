let Errors = require('../src/errors');
let should = require('should');
let Promise = require('bluebird');

describe('Errors', () => {

  describe('NotFound', () => {
    it('should be of type Error', () => {
      should(Errors.NotFound.prototype).instanceof(Error);
    });

    it('should be caught with bluebird', done => {
      Promise.resolve()
        .then(() => { throw new Errors.NotFound(); })
        .then(() => done('I should have not been called'))
        .catch(Errors.NotFound, err => {
          should(err.status).equal(404);
          done();
        });
    });
  });

  describe('InternalServerError', () => {
    it('should be of type Error', () => {
      should(Errors.InternalServerError.prototype).instanceof(Error);
    });

    it('should be caught with bluebird', done => {
      Promise.resolve()
        .then(() => { throw new Errors.InternalServerError(); })
        .then(() => done('I should have not been called'))
        .catch(Errors.InternalServerError, err => {
          should(err.status).equal(500);
          done();
        });
    });
  });

  describe('API', () => {
    it('should handle two exceptions', done => {
      Promise.resolve()
        .then(() => { throw new Errors.InternalServerError(); })
        .then(() => done('I should have not been called'))
        .catch(Errors.NotFound, err => done('I should have not been called'))
        .catch(err => {
          should(err.status).equal(500);
          done();
        });
    });
  });
});
