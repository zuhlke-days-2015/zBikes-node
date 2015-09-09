'use strict';

var express = require('express');
var router = express.Router();
var paperwork = require('paperwork');
var _ = require('lodash');

var HttpError = require('../errors');
var Station = require('../model/station');

var schema = {
  name: String,
  location: {
    lat: Number,
    long: Number
  }
  //availableBikes: [String]
};

router.get('/:stationId', (req, res, next) =>
  Station.get(req.params.stationId)
    .then(station => res.send(station))
    .catch(next)
);

router.put('/:stationId', paperwork.accept(schema), (req, res, next) =>
  new Station(_.extend({}, req.body, {id: req.params.stationId}))
    .save()
    .then(response => res.send(response))
    .catch(next)
);

router.post('/:stationId/bike', paperwork.accept(schema), (req, res, next) => {});

router.post('/:stationId/bike/:bikeId', paperwork.accept(schema), (req, res, next) => {});

router.delete('/all', (req, res, next) => {
});

router.get('/near/:lat/:long', (req, res, next) => {});

function halify(item) {
  var self = '/station/' + item.id;
  return _.extend(item, {
    hireUrl: "/station/" + item.id + "/bike"
  });
}

module.exports = router;
