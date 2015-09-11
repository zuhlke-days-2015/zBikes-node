'use strict';

var express = require('express');
var router = express.Router();
var paperwork = require('paperwork');
var _ = require('lodash');

var Station = require('../model/station');
var Errors = require('../errors');

var schema = {
  name: String,
  location: {
    lat: Number,
    long: Number
  },
  availableBikes: [String]
};

var locationify = (id) => '/station/' + id;

router.get('/:stationId', (req, res, next) =>
  Station.get(req.params.stationId)
    .then(station => {
      res.append('Location', locationify(station.id));
      res.send(station.strip());
    })
    .error(next)
);

router.put('/:stationId', paperwork.accept(schema), (req, res, next) =>
  Station.get(req.params.stationId)
    .then(existing => Station.update(_.merge(existing, req.body)))
    .then(updated => {
      res.append('Location', locationify(updated.id));
      res.send(updated.strip());
    })
    .catch(Errors.NotFound, err => {
      Station.save(_.extend({}, req.body, {id: req.params.stationId}))
        .then(saved => {
          res.append('Location', locationify(saved.id));
          res.send(saved.strip());
        })
    })
    .error(next)
);

router.post('/:stationId/bike', paperwork.accept(schema), (req, res, next) => {});

router.post('/:stationId/bike/:bikeId', paperwork.accept(schema), (req, res, next) => {});

router.delete('/all', (req, res, next) => {
  require('../couchdb')
    .doIt()
    .then(() => res.sendStatus(200))
    .error(next);
});

router.get('/near/:lat/:long', (req, res, next) => {});

module.exports = router;
