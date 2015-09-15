'use strict';

let unirest = require('unirest'),
    Promise = require('bluebird'),
    qs = require('querystring'),
    _ = require('lodash'),
    sprintf = require('sprintf'),
    Immutable = require('immutable');

let GeoHash = require('../geohash'),
    couchdb = require('../configuration').couchdb,
    HttpError = require('../errors').HttpError,
    NotFound = require('../errors').NotFound;

class Station {

  static create(data, id) {
    let station = Immutable.fromJS(data);
    if (id)
      station = station.set('id', id);
    if (!station.has('geohash'))
      station = station.set('geohash', GeoHash.encode(data.location.lat, data.location.long));
    return station;
  }

  static get(id) {
    return new Promise((resolve, reject) => {
      let url = sprintf('%s/%s?%s', couchdb.stations, couchdb.views.byId, qs.stringify({key: '"' + id + '"', include_docs: true}));
      unirest.get(url)
        .headers({Accept: 'application/json'})
        .end(response => {
          if (response.status !== 200)
            return reject(new HttpError(response.status, response.body.reason));
          if (_.isEmpty(response.body.rows))
            return reject(new NotFound());
          resolve(Station.create(_.first(response.body.rows).doc));
        });
    });
  };

  static getFor(couchId) {
    return new Promise((resolve, reject) => {
      unirest.get(sprintf('%s/%s', couchdb.stations, couchId))
        .headers({Accept: 'application/json'})
        .end(response => {
          if (response.status !== 200)
            return reject(new HttpError(response.status, response.body.reason));
          resolve(Station.create(response.body));
        });
    });
  };

  static save(data, id) {
    return new Promise((resolve, reject) => {
      unirest.post(couchdb.stations)
        .type('json')
        .send(Station.create(data, id))
        .end(response => {
          if (response.status !== 201)
            return reject(new HttpError(response.status, response.body.reason));
          resolve(Station.getFor(response.body.id));
        });
    });
  };

  static update(existing, updates) {
    return new Promise((resolve, reject) => {
      unirest.put(sprintf('%s/%s', couchdb.stations, existing.get('_id')))
        .type('json')
        .send(existing.merge(updates))
        .end(response => {
          if (response.status !== 201)
            return reject(new HttpError(response.status, response.body.reason));
          resolve(Station.getFor(response.body.id));
        });
    });
  }

  static findClosest(lat, long, resolution) {
    let geohash = GeoHash.encode(lat, long);
    if (resolution) geohash = geohash.substr(0, resolution);

    let neighbours = {};
    neighbours.center = geohash;
    neighbours.top = GeoHash.calculateAdjacent(geohash, 'top');
    neighbours.bottom = GeoHash.calculateAdjacent(geohash, 'bottom');
    neighbours.right = GeoHash.calculateAdjacent(geohash, 'right');
    neighbours.left = GeoHash.calculateAdjacent(geohash, 'left');
    neighbours.topleft = GeoHash.calculateAdjacent(neighbours.left, 'top');
    neighbours.topright = GeoHash.calculateAdjacent(neighbours.right, 'top');
    neighbours.bottomright = GeoHash.calculateAdjacent(neighbours.right, 'bottom');
    neighbours.bottomleft = GeoHash.calculateAdjacent(neighbours.left, 'bottom');

    let url = sprintf('%s/%s', couchdb.stations, couchdb.views.byExactGeoHash);
    let requests = [];

    _.each(neighbours, (localhash, spot) => {
      requests.push(new Promise((resolve, reject) => {
        unirest.post(url).headers({Accept: 'application/json'})
          .type('json')
          .send({
            startkey: [localhash, {}],
            endkey : [localhash],
            descending : true,
            reduce : false,
            limit : 10,
            include_docs : true
          })
          .end(response => {
            if (response.status !== 200)
              return reject(new HttpError(response.status, response.body.reason));
            resolve(response.body.rows);
          });
        }));
    });

    return Promise.all(requests);
  }

  static strip(station) {
    return station.delete('_id').delete('_rev').delete('id');
  }
}

module.exports = Station;
