var Errors = require('../src/errors');
var should = require('should');
var Promise = require('bluebird');

describe('Errors', function() {

  describe('NotFound', function() {
    it('should be of type Error', function() {
      should(Errors.NotFound.prototype).instanceof(Error);
    });

    it('should be caught with bluebird', function(done) {
      Promise.resolve()
        .then(() => { throw new Errors.NotFound(); })
        .then(() => done('I should have not been called'))
        .catch(Errors.NotFound, err => {
          should(err.status).equal(404);
          done();
        });
    });
  });

  describe('InternalServerError', function() {
    it('should be of type Error', function() {
      should(Errors.InternalServerError.prototype).instanceof(Error);
    });

    it('should be caught with bluebird', function(done) {
      Promise.resolve()
        .then(() => { throw new Errors.InternalServerError(); })
        .then(() => done('I should have not been called'))
        .catch(Errors.InternalServerError, err => {
          should(err.status).equal(500);
          done();
        });
    });
  });

  describe('API', function() {
    it('should handle two exceptions', function(done) {
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
