'use strict';

let unirest = require('unirest'),
  Promise = require('bluebird'),
  _ = require('lodash'),
  Immutable = require('immutable');

let auth = require('../configuration').auth,
    Unauthorised = require('../errors').Unauthorised;

class Customer {

  static authenticate(username) {
    return new Promise((resolve, reject) => {
      unirest.get(`${auth.url}${username}`)
        .type('json')
        .end(response => {
          if (response.status !== 200)
            return reject(new Unauthorised(response.status, response.body));
          resolve(Immutable.fromJS(response.body));
        });
    });
  }
}

module.exports = Customer;
