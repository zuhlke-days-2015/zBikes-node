'use strict';

var Station = require('../src/model/station');
var geohash = require('../src/geohash');
var should = require('should');

describe('geohash', function() {
  it('should encode long and lat coordinates', function() {
    should(geohash.encode(51.5286416, -0.1015987)).equal('gcpvjsw00e48');
  });

  it('should decode long and lat coordinates', function() {
    let coordinates = geohash.decode('gcpvjsw00e48');

    should(coordinates.latitude)
      .containEql(51.52864158153534)
      .and.containEql(51.5286417491734)
      .and.containEql(51.52864166535437);

    should(coordinates.longitude)
      .containEql(-0.10159872472286224)
      .and.containEql(-0.10159838944673538)
      .and.containEql(-0.10159855708479881);
  });

  it('should encode the station long and lat coordinates', function() {
    let station = new Station({
      name: 'London',
      location: {
        lat: 51.5286416,
        long: -0.1015987
      }
    });
    should(station.geohash).equal('gcpvjsw00e48');
  });
});
