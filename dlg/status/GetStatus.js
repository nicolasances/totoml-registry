var mongo = require('mongodb');
var config = require('../../config');
var converter = require('./Converter');

var MongoClient = mongo.MongoClient;

exports.do = function(req) {

  return new Promise(function(success, failure) {

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      db.db(config.dbName).collection(config.collections.status).find({modelName: req.params.modelName}).toArray(function(err, array) {

        db.close();

        success(converter.statusTO(array[0]));

      });
    });
  });

}
