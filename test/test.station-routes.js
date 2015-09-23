'use strict';

process.env.NODE_ENV = 'test';

let should = require('should'),
    request = require('supertest'),
    async = require('async'),
    _ = require('lodash');

describe('API:', () => {

  let app;

  beforeEach(done => {
    app = require('../src/app.js');
    request(app).delete('/station/all').expect(200, done);
  });

  describe('PUT /station/:stationId', () => {
    it('should create a new station', done => {
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

    it('should update a new station', done => {
      let agent = request(app);

      let createItem = cb => {
        agent.put('/station/123456')
          .set('Content-Type', 'application/json')
          .send({
            name: 'London',
            location: { lat: 51.5286416, long: -0.1015987 },
            availableBikes: ["001","002","003","004"]
          })
          .expect(200, cb);
      }

      let updateItem = cb => {
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

    it('should validate the payload and respond with 400', done => {
      request(app)
        .put('/station/12345')
        .set('Content-Type', 'application/json')
        .send({
          location: { lat: 51.5286416, long: -0.1015987 },
          availableBikes: ["001","002","003","004"]
        })
        .expect('Content-Type', /json/)
        .expect(400, done)
    });

    it('should validate the payload and not allow empty strings', done => {
      request(app)
        .put('/station/12345')
        .set('Content-Type', 'application/json')
        .send({
          name: '',
          location: { lat: 51.5286416, long: -0.1015987 },
          availableBikes: ["001","002","003","004"]
        })
        .expect('Content-Type', /json/)
        .expect(400, done)
    });

  });

  describe('GET /station/:stationId', () => {
    beforeEach(done => {
      request(app).put('/station/1234567')
        .set('Content-Type', 'application/json')
        .send({
          name: 'London',
          location: { lat: 51.5286416, long: -0.1015987 },
          availableBikes: ["001","002","003","004"]
        })
        .expect(200, done);
    });

    it('should return a 200 for an existing station', done => {
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

    it('should return a 404 for a missing station', done => {
      request(app)
        .get('/station/-2')
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404, done);
    });
  });

  describe('GET /station/near/:lat/:long', () => {
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

    it('should find stations near London', done => {
      request(app)
        .get('/station/near/51.5286416/-0.1015987?resolution=8')
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) done(err);
          should(_.get(res, 'body.items[0].geohash')).equal('gcpvjsw00e48');
          done();
        });
    });
  });

  describe('POST /station/:stationId/bike', () => {
    it('should return 401 if the user is not authenticated', done => {
      request(app)
        .post('/station/123456/bike')
        .set('Content-Type', 'application/json')
        .send({
          username: 'foobar',
          action: 'hire'
        })
        .expect('Content-Type', /json/)
        .expect(401, done);
    });
  });

});
