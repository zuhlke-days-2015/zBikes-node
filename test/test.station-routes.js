'use strict';

process.env.NODE_ENV = 'test';

var should = require('should');
var request = require('supertest');
var async = require('async');

describe('API:', function() {

  var app;

  beforeEach(function(done) {
    app = require('../src/app.js');
    request(app).delete('/station/all').expect(200, done);
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
      let agent = request(app);

      let createItem = (cb) => {
        agent.put('/station/123456')
          .set('Content-Type', 'application/json')
          .send({
            name: 'London',
            location: { lat: 51.5286416, long: -0.1015987 },
            availableBikes: ["001","002","003","004"]
          })
          .expect(200, cb);
      }

      let updateItem = (cb) => {
        agent.put('/station/123456')
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
          .expect('Location', '/station/123456', cb)
      }

      async.series([createItem, updateItem], done);
    });
  });

  describe('GET /station/:stationId', function() {
    beforeEach(function(done) {
      request(app).put('/station/1234567')
        .set('Content-Type', 'application/json')
        .send({
          name: 'London',
          location: { lat: 51.5286416, long: -0.1015987 },
          availableBikes: ["001","002","003","004"]
        })
        .expect(200, done);
    });

    it('should return a 200 for an existing station', function(done) {
      request(app)
        .get('/station/1234567')
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, {
          name: 'London',
          geohash: 'gcpvjsw00e48',
          location: { lat: 51.5286416, long: -0.1015987 },
          availableBikes: ["001","002","003","004"]
        })
        .expect('Location', '/station/1234567', done)
    });

    it('should return a 404 for a missing station', function(done) {
      request(app)
        .get('/station/-2')
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404, done);
    });
  });

  describe('GET /station/near/:lat/:long', function() {
    beforeEach(function(done) {
      request(app).put('/station/1234567')
        .set('Content-Type', 'application/json')
        .send({
          name: 'London',
          location: { lat: 51.5286416, long: -0.1015987 },
          availableBikes: ["001","002","003","004"]
        })
        .expect(200, done);
    });

    it('should find stations near London', function(done) {
      request(app)
        .get('/station/near/51.5286416/-0.1015987')
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) done(err);
          should(res.body.items[0].geohash).equal('gcpvjsw00e48');
          done();
        });
    });
  });

});
