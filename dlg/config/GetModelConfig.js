var mongo = require('mongodb');
var config = require('../../config');
var converter = require('./Converter');

var MongoClient = mongo.MongoClient;

exports.do = function(req) {

  return new Promise(function(success, failure) {

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      db.db(config.dbName).collection(config.collections.modelConfig).find({modelName: reqs.params.modelName}).toArray(function(err, array) {

        db.close();

        success(converter.modelConfigTO(array[0]));

      });
    });
  });

}
