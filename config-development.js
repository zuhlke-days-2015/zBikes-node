module.exports = {
  "port": 8080,
  "base_uri": "/api",
  "couchdb": {
    "stations": "http://127.0.0.1:5984/stations",
    "views": {
      "byId": "_design/stations/_view/by_id"  
    }
  }
}
