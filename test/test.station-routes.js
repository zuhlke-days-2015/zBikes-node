process.env.NODE_ENV = 'test';

var should = require('should');
var request = require('supertest');

describe('API:', function() {

  var app;

  beforeEach(function() {
    app = require('../src/app.js');
  });

  describe('PUT /station/:stationId', function() {
    it('should create a new station', function(done) {
      request(app)
        .put('/station/12345')
        .set('Content-Type', 'application/json')
        .send({
          name: 'London',
          location: {
            lat: 51.5286416,
            long: -0.1015987
          }
        })
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('GET /station/:stationId', function() {
    it('should return a 200 for an existing station', function(done) {
      request(app)
        .get('/station/12345')
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(res => {
          res.body._id = '2e386b317213122389b150c39d00cab8';
          res.body._rev = '1-358819abb240d616502ced3b3ae36147';
        })
        .expect(200, {
          _id: '2e386b317213122389b150c39d00cab8',
          _rev: '1-358819abb240d616502ced3b3ae36147',
          id: '12345',
          name: 'London',
          location: {
            lat: 51.5286416,
            long: -0.1015987
          }
        }, done);
    });

    it('should return a 404 for a missing station', function(done) {
      request(app)
        .get('/station/-2')
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404, done);
    });
  });

});
