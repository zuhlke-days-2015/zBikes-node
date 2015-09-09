'use strict';

let couchdb = require('../configuration').couchdb;
let Promise = require('bluebird');
let request = Promise.promisifyAll(require('request'));
let _ = require('lodash');

/**
 * Deletes the stations database.
 */
 let deleteStations = () => request
   .delAsync(couchdb.stations)
   .spread((response, body) => {
     if (response.statusCode !== 200)
       throw new Error(JSON.parse(body).reason);
   });

/**
 * Creates the stations database.
 */
let createStations = () => request
  .putAsync(couchdb.stations)
  .spread((response, body) => {
    if (response.statusCode !== 201)
      throw new Error(JSON.parse(body).reason);
  });

/**
 * Creates a view for searching stations by id.
 */
let createStationsByIdView = () => {
  let url = couchdb.stations + '/_design/stations';
  request.putAsync({
    url: url,
    json: true,
    body: {"_id":"_design/stations","language":"javascript","views":{"by_id":{"map":"function(doc) {\n  if (doc.id) emit(doc.id, null);\n}"}}}
  })
  .spread((response, body) => {
    if (response.statusCode !== 201)
      throw new Error(JSON.parse(body).reason);
  });
};

module.exports = {
  doIt: function() {
    return deleteStations().then(createStations).then(createStationsByIdView);
  }
}
