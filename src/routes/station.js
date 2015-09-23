'use strict';

let express = require('express');
let router = express.Router();
let paperwork = require('paperwork');
let _ = require('lodash');

let Station = require('../model/station');
let Customer = require('../model/customer');

let nonEmpty = s => !_.isEmpty(s);
let stationSchema = {
  name: paperwork.all(String, nonEmpty),
  location: {
    lat: Number,
    long: Number
  },
  availableBikes: [String]
};

let hireSchema = {
  username: paperwork.all(String, nonEmpty),
  action: paperwork.all(String, nonEmpty)
};

router.get('/:stationId', (req, res, next) => {
  Station.get(req.params.stationId)
    .then(station => {
      res.append('Location', '/station/' + station.get('id'));
      res.send(Station.strip(station));
    })
    .error(next)
});

router.put('/:stationId', paperwork.accept(stationSchema), (req, res, next) => {
  Station.get(req.params.stationId)
    .then(existing => Station.update(existing, req.body),
          notFound => Station.save(req.body, req.params.stationId))
    .then(station => {
      res.append('Location', '/station/' + station.get('id'));
      res.send(Station.strip(station));
    })
    .error(next)
});

router.post('/:stationId/bike', paperwork.accept(hireSchema), (req, res, next) => {
  /*Promise.all([Customer.authenticate(req.body.username), Station.get(req.params.stationId)])
    .then(results => {
      console.log(results);
    })
    .catch()
    .error(next)*/
});

router.post('/:stationId/bike/:bikeId', paperwork.accept(hireSchema), (req, res, next) => {

});

router.get('/near/:lat/:long', (req, res, next) => {
  Station.findClosest(req.params.lat, req.params.long, req.query.resolution || 8)
    .then(results => res.send({items: results}));
});

router.delete('/all', (req, res, next) => {
  require('../couchdb')
    .deleteAll()
    .then(() => res.status(200).send({status: 'ok'}))
    .error(next);
});

module.exports = router;
