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

router.get('/:stationId', (req, res, next) => {
  function ok(station) {
    res.append('Location', '/station/' + station.id);
    res.send(station.strip());
  }

  Station.get(req.params.stationId)
    .then(station => ok(station), notFound => res.status(404).send({status: 'not found'}))
    .error(next)
});

router.put('/:stationId', paperwork.accept(schema), (req, res, next) => {
  function ok(station) {
    res.append('Location', '/station/' + station.id);
    res.send(station.strip());
  }

  // TODO: this is ugly!
  Station.get(req.params.stationId)
    .then(existing => Station.update(_.merge(existing, req.body)), notFound => Station.save(_.extend({}, req.body, {id: req.params.stationId})))
    .then(updated => ok(updated))
    .error(next)
});

router.post('/:stationId/bike', paperwork.accept(schema), (req, res, next) => {});

router.post('/:stationId/bike/:bikeId', paperwork.accept(schema), (req, res, next) => {});

router.delete('/all', (req, res, next) => {
  require('../couchdb').doIt()
    .then(() => res.status(200).send({status: 'ok'}))
    .error(next);
});

router.get('/near/:lat/:long', (req, res, next) => {});

module.exports = router;
