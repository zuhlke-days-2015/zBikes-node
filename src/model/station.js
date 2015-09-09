'use strict';

var geohash = require('../geohash');
var couchdb = require('../configuration').couchdb;
var HttpError = require('../errors');

var Promise = require('bluebird');
var request = Promise.promisifyAll(require('request'));
var qs = require('querystring');
var _ = require('lodash');

class Station {
  constructor(context) {
    _.extend(this, context);
    this.id = this.id || -1;
    this.location = this.location || {lat: 0, long: 0};
    this.name = this.name || 'Unknown';
  }

  static get(id) {
    return request
      .getAsync(couchdb.stations + '/' + couchdb.views.byId + '?' + qs.stringify({key: '"' + id + '"', include_docs: true}))
      .spread((response, body) => {
        if (response.statusCode !== 200)
          throw new HttpError();
        let document = JSON.parse(body);
        if (!_.get(document, 'rows[0].doc'))
          throw new HttpError(404, 'Not Found');
        return new Station(document.rows[0].doc);
      });
  };

  static save(body) {
    return request
      .postAsync({
        url: couchdb.stations,
        json: true,
        body: body
      })
      .spread((response, body) => Station.getFor(body.id));
  };

  static getFor(_id) {
    return request
      .getAsync(couchdb.stations + '/' + _id)
      .spread((response, body) => {
        if (response.statusCode !== 200)
          throw new HttpError(response.statusCode);
        return new Station(JSON.parse(body));
      });
  };

  update() {
    return request
      .putAsync({
        url: couchdb.stations + '/' + this._id,
        json: true,
        body: this
      })
      .spread((response, body) => new Station(JSON.parse(body)));
  }

  get geohash() {
    return geohash.encode(this.location.lat, this.location.long);
  };

  strip() {
    return _.omit(this, ['_id', '_rev', 'id']);
  }
}

module.exports = Station;
