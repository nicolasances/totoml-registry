var mongo = require('mongodb');
var config = require('../../config');
var converter = require('./Converter');

var MongoClient = mongo.MongoClient;

exports.do = function(req) {

  return new Promise(function(success, failure) {

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      console.log('Received GET on a model');
      console.log(req);
      
      db.db(config.dbName).collection(config.collections.models).find({name: req.params.name}).toArray(function(err, array) {

        console.log(array[0]);

        db.close();

        success(converter.modelTO(array[0]));

      });
    });
  });

}
