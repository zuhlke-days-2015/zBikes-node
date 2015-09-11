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
          location: { lat: 51.5286416, long: -0.1015987 },
          availableBikes: ["001","002","003","004"]
        })
        .expect('Content-Type', /json/)
        .expect(200, {
          name: 'London',
          geohash: 'gcpvjsw00e48',
          location: { lat: 51.5286416, long: -0.1015987 },
          availableBikes: ["001","002","003","004"]
        })
        .expect('Location', '/station/12345', done)
    });
    it('should update a new station', function(done) {
      request(app)
        .put('/station/123456')
        .set('Content-Type', 'application/json')
        .send({
          name: 'London',
          location: { lat: 51.5286416, long: -0.1015987 },
          availableBikes: ["001","002","003","004"]
        }).end();

      request(app)
        .put('/station/123456')
        .set('Content-Type', 'application/json')
        .send({
          name: 'London (N4)',
          location: { lat: 51.5286416, long: -0.1015987 },
          availableBikes: ["001","002","003","004"]
        })
        .expect('Content-Type', /json/)
        .expect(200, {
          name: 'London (N4)',
          geohash: 'gcpvjsw00e48',
          location: { lat: 51.5286416, long: -0.1015987 },
          availableBikes: ["001","002","003","004"]
        })
        .expect('Location', '/station/123456', done)
    });
  });

  describe('GET /station/:stationId', function() {
    it('should return a 200 for an existing station', function(done) {
      request(app)
        .get('/station/12345')
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, {
          name: 'London',
          geohash: 'gcpvjsw00e48',
          location: { lat: 51.5286416, long: -0.1015987 },
          availableBikes: ["001","002","003","004"]
        })
        .expect('Location', '/station/12345', done)
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
