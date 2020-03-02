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

      model = converter.modelPO(body)
      
      db.db(config.dbName).collection(config.collections.models).insertOne(model, function(err, res) {

        db.close();

        model.id = res.insertedId;

        success(model);

      });
    });
  });
}
