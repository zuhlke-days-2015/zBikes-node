'use strict';

let express = require('express');
let router = express.Router();
let paperwork = require('paperwork');
let _ = require('lodash');

let Station = require('../model/station');
let NotFound = require('../errors').NotFound;

let schema = {
  name: String,
  location: {
    lat: Number,
    long: Number
  },
  availableBikes: [String]
};

let strip = station => station.strip();

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

router.get('/near/:lat/:long', (req, res, next) => {
    Station.findClosest(req.params.lat, req.params.long, req.query.resolution || 8)
      .then(results => res.send({items: results}));
});

module.exports = router;
