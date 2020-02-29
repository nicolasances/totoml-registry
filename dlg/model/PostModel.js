var mongo = require('mongodb');
var config = require('../../config');
var converter = require('./Converter');

var MongoClient = mongo.MongoClient;

exports.do = function(request) {

  let body = request.body;

  return new Promise(function(success, failure) {

    // Some validation
    if (!body.name) {failure({code: 400, message: 'Missing "name" field.'}); return;}

    return MongoClient.connect(config.mongoUrl, function(err, db) {
      
      db.db(config.dbName).collection(config.collections.models).insertOne(converter.modelPO(body), function(err, res) {

        db.close();

        success({id: res.insertedId});

      });
    });
  });
}
