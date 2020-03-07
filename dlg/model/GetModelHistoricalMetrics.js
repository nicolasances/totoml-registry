var mongo = require('mongodb');
var config = require('../../config');
var converter = require('./Converter');

var MongoClient = mongo.MongoClient;

exports.do = function(request) {

  return new Promise(function(success, failure) {

    // Some validation
    if (!request.params.name) {failure({code: 400, message: 'Missing "name" field.'}); return;}

    return MongoClient.connect(config.mongoUrl, function(err, db) {
      
      // Update the current model metrics
      db.db(config.dbName).collection(config.collections.historicalMetrics).find({name: request.params.name}).sort({date: 1}).toArray(function(err, array) {
        
        db.close();

        if (array == null) {
          success({metrics: []});
          return;
        }

        var metrics = [];

        for (var i = 0; i < array.length; i++) {
          metrics.push(converter.modelHistoricalMetricTO(array[i]));
        }

        success({metrics: metrics});

      });
    });
  });
}
