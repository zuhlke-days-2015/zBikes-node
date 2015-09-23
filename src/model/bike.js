'use strict';

let unirest = require('unirest'),
  Promise = require('bluebird'),
  _ = require('lodash'),
  Immutable = require('immutable');

let auth = require('../configuration').auth,
    Unauthorised = require('../errors').Unauthorised;

class Bike {

  static hire(stationid, username) {
  }
}

module.exports = Bike;
