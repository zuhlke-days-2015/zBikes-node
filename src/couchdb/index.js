'use strict';

let couchdb = require('../configuration').couchdb;
var unirest = require('unirest');
let Promise = require('bluebird');
let _ = require('lodash');

/**
 * Deletes the stations database.
 */
let deleteStations = () => {
  return new Promise((resolve, reject) => {
    unirest.delete(couchdb.stations)
      .headers({Accept: 'application/json'})
      .end(response => response.statusCode === 200 ||
        response.statusCode === 404 ? resolve() : reject(response.body))
  });
}

/**
 * Creates the stations database.
 */
 let createStations = () => {
   return new Promise((resolve, reject) => {
     unirest.put(couchdb.stations)
      .headers({Accept: 'application/json'})
      .end(response => response.statusCode === 201 ? resolve() : reject(response.body))
   });
 }

/**
 * Creates a view for searching stations by id.
 */
 let createStationsByIdView = () => {
   return new Promise((resolve, reject) => {
     unirest.put(couchdb.stations + '/_design/stations')
      .headers({Accept: 'application/json'})
      .type('json')
      .send({"_id":"_design/stations","language":"javascript","views":{"by_id":{"map":"function(doc) {\n  if (doc.id) emit(doc.id, null);\n}"}}})
      .end(response => response.statusCode === 201 ? resolve() : reject(response.body))
   });
 }

module.exports = {
  doIt: function() {
    return deleteStations()
      .then(createStations)
      .then(createStationsByIdView)
      .error(err => console.log(err));
  }
}
