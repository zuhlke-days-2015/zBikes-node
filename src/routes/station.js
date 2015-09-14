'use strict';

var express = require('express');
var router = express.Router();
var paperwork = require('paperwork');
var _ = require('lodash');

var Station = require('../model/station');
var NotFound = require('../errors').NotFound;

var schema = {
  name: String,
  location: {
    lat: Number,
    long: Number
  },
  availableBikes: [String]
};

var strip = station => station.strip();

router.get('/:stationId', (req, res, next) => {
  Station.get(req.params.stationId)
    .then(station => {
      res.append('Location', '/station/' + station.get('id'));
      res.send(Station.strip(station));
    })
    .catch(NotFound, error => next(error))
    .error(next)
});

router.put('/:stationId', paperwork.accept(schema), (req, res, next) => {
  Station.get(req.params.stationId)
    .then(existing => Station.update(existing, req.body),
          notFound => Station.save(req.body, req.params.stationId))
    .then(station => {
      res.append('Location', '/station/' + station.get('id'));
      res.send(Station.strip(station));
    })
    .error(next)
});

router.post('/:stationId/bike', paperwork.accept(schema), (req, res, next) => {});

router.post('/:stationId/bike/:bikeId', paperwork.accept(schema), (req, res, next) => {});

router.delete('/all', (req, res, next) => {
  require('../couchdb')
    .deleteAll()
    .then(() => res.status(200).send({status: 'ok'}))
    .error(next);
});

router.get('/near/:lat/:long', (req, res, next) => {});

module.exports = router;
