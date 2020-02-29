var mongo = require('mongodb');
var config = require('../../config');
var converter = require('./Converter');

var MongoClient = mongo.MongoClient;

/**
 * Posts a challengers metrics
 */
exports.do = function(request) {

  let body = request.body;

  return new Promise(function(success, failure) {

    // Some validation
    if (!request.params.id) {failure({code: 400, message: 'Missing the "id" of the challenger in the path'}); return; }
    if (!body.metrics || body.metrics.length == 0) {failure({code: 400, message: 'Missing "metrics" in the body.'}); return;}

    console.log(body);
    
    metrics = body.metrics;

    for (metric in metrics) {
      if (!metric.name) {failure({code: 400, message: 'One of the metrics missed the "name" attribute'}); return;}
      if (!metric.value) {failure({code: 400, message: 'One of the metrics missed the "value" attribute'}); return;}
    }

    return MongoClient.connect(config.mongoUrl, function(err, db) {
      
      db.db(config.dbName).collection(config.collections.challengersMetrics).insertOne(converter.metricPO(request.params.id, body), function(err, res) {

        db.close();

        success({id: res.insertedId});

      });
    });
  });
}
