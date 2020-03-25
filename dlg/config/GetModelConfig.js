var mongo = require('mongodb');
var config = require('../../config');
var converter = require('./Converter');

var MongoClient = mongo.MongoClient;

exports.do = function(req) {

  return new Promise(function(success, failure) {

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      db.db(config.dbName).collection(config.collections.modelConfig).find({modelName: req.params.modelName}).toArray(function(err, array) {

        db.close();

        if (!array || array.length == 0) {
          success({});
          return;
        }

        success(converter.modelConfigTO(array[0]));

      });
    });
  });

}
