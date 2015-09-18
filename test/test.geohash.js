'use strict';

let Station = require('../src/model/station');
let geohash = require('../src/geohash');
let should = require('should');

describe('geohash', () => {
  it('should encode long and lat coordinates', () => {
    should(geohash.encode(51.5286416, -0.1015987)).equal('gcpvjsw00e48');
  });

  it('should decode long and lat coordinates', () => {
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

  it('should encode the station long and lat coordinates', () => {
    let station = Station.create({
      name: 'London',
      location: {
        lat: 51.5286416,
        long: -0.1015987
      }
    });
    should(station.get('geohash')).equal('gcpvjsw00e48');
  });
});
