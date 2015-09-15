module.exports = {
  "port": 9000,
  "base_uri": "/api",
  "couchdb": {
    "stations": "http://127.0.0.1:5984/stations",
    "views": {
      "byId": "_design/stations/_view/by_id",
      "byGeoHash": "_design/stations/_view/by_geohash",
      "byExactGeoHash": "_design/stations/_view/by_geohash_exact"
    }
  }
}
