'use strict';

var geohash = require('../geohash');
var couchdb = require('../configuration').couchdb;
var Errors = require('../errors');

var unirest = require('unirest');
var Promise = require('bluebird');
var qs = require('querystring');
var _ = require('lodash');
var _s = require('sprintf');

class Station {
  constructor(context) {
    _.extend(this, context);
    Object.defineProperty(this, 'geohash', {
      get: () => geohash.encode(this.location.lat, this.location.long),
      enumerable: true
    });
  }

  static get(id) {
    return new Promise((resolve, reject) => {
      let url = _s('%s/%s?%s', couchdb.stations, couchdb.views.byId, qs.stringify({key: '"' + id + '"', include_docs: true}));
      unirest.get(url)
        .headers({Accept: 'application/json'})
        .end(response => {
          if (response.status !== 200)
            return reject(new Errors.HttpError(response.status, response.body.reason));
          if (_.isEmpty(response.body.rows))
            return reject(new Errors.NotFound());
          resolve(new Station(_.first(response.body.rows).doc));
        });
    });
  };

  static save(station) {
    return new Promise((resolve, reject) => {
      unirest.post(couchdb.stations)
        .type('json')
        .send(station)
        .end(response => {
          if (response.status !== 201)
            return reject(new Errors.HttpError(response.status, response.body.reason));
          resolve(Station.getFor(response.body.id));
        });
    });
  };

  static getFor(couchId) {
    return new Promise((resolve, reject) => {
      unirest.get(_s('%s/%s', couchdb.stations, couchId))
      .headers({Accept: 'application/json'})
      .end(response => {
        if (response.status !== 200)
          return reject(new Errors.HttpError(response.status, response.body.reason));
        resolve(new Station(response.body));
      });
    });
  };

  static update(updates) {
    return new Promise((resolve, reject) => {
      unirest.put(_s('%s/%s', couchdb.stations, updates._id))
      .type('json')
      .send(updates)
      .end(response => {
        if (response.status !== 201)
          return reject(new Errors.HttpError(response.status, response.body.reason));
          resolve(Station.getFor(response.body.id));
        });
      });
  }

  strip() {
    return _.omit(this, ['_id', '_rev', 'id']);
  }
}

module.exports = Station;
