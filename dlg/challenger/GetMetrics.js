var mongo = require('mongodb');
var config = require('../../config');
var converter = require('./Converter');

var MongoClient = mongo.MongoClient;

exports.do = function(req) {

  return new Promise(function(success, failure) {

    // Validation
    if (!req.params.id) {failure({code: 400, message: 'Missing the challenger "id" in the path'}); return;}

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      db.db(config.dbName).collection(config.collections.challengersMetrics).find(converter.find({challengerId: req.params.id})).toArray(function(err, array) {

        db.close();

        if (array == null) {
          success({});
          return;
        }
        
        success(converter.metricTO(array[0]));

      });
    });
  });

}
